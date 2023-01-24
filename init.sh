#!/bin/bash

set -o pipefail -e

# Formatting
BLACK='\033[0;30m'
WHITE='\033[0;37m'
GREY='\033[0;90m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
BMAGENTA='\033[1;35m'
BG_WHITE='\033[47m'
BG_GREY='\033[100m'
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'
BG_PURPLE='\033[45m'
BG_CYAN='\033[46m'
BG_ORANGE='\033[43m'
RESET='\033[0m'

# Utility functions
function show_banner {
  if [[ "$@" != *"--quiet"* ]] && [[ "$@" != *"-q"* ]]; then
    log "${WHITE}===================================================${RESET}"
    log "${GREY} _____ ${RED}_${RESET}         ${BLUE} _${RESET}${GREY}    _____${RESET} ${WHITE}_           ${RESET}${RED} _    ${RESET}"
    log "${GREY}|  __ ${RED}(_)${RESET}        ${BLUE}| |${RESET}${GREY}  / ____${RESET}${WHITE}| |          ${RESET}${RED}| |   ${RESET}"
    log "${GREY}| |__) |${CYAN}__  __${RESET}___${BLUE}| |${RESET}${GREY} | |    ${RESET}${WHITE}| | ${RESET}${PURPLE}___${RESET}  ${CYAN} ___${RED}| | __${RESET}"
    log "${GREY}|  ___/ ${CYAN}\ \/ /${RESET} _ \\\\${BLUE} |${RESET}${GREY} | |    ${RESET}${WHITE}| |${RESET}${PURPLE}/ _ \\\\${RESET} ${CYAN}/ __${RED}| |/ /${RESET}"
    log "${GREY}| |   | ${CYAN}|>  < ${RESET} __/${BLUE} | ${RESET}${GREY}| |____${RESET}${WHITE}| |${RESET}${PURPLE} (_) ${RESET}${CYAN}| (__${RED}|   < ${RESET}"
    log "${GREY}|_|   |_${CYAN}/_/\_\\\\${RESET}___${BLUE}|_|${RESET}${GREY}  \_____${RESET}${WHITE}|_|${RESET}${PURPLE}\___/${RESET} ${CYAN}\___${RED}|_|\_\\\\${RESET}"
    log "${WHITE}===================================================${RESET}"
  fi
}

function check_if_running {
  if [ -f "/var/run/pixelclock.pid" ]; then
    PID=$(cat /var/run/pixelclock.pid)
    if ps -p $PID > /dev/null; then
      return 0
    fi
  fi

  return 1
}

function check_if_root {
  if [ "$EUID" -ne 0 ]; then
    log "${RED}This script must be run as root. Exiting...${RESET}"
    exit 1
  fi
}

function check_for_updates {
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$BRANCH" == "main" ]]; then
    git fetch origin main || log "${RED}Failed to fetch updates. Skipping...${RESET}"
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
      log "${YELLOW}There are updates available.${RESET}"
      return 0
    fi
  fi

  return 1
}

function rotate_logs {
  if [ -f "./logs/latest.log" ]; then
      FILEDATE=$(date -r ./logs/latest.log "+%Y-%m-%d")
      FILENUMBER=0
      while [ -f "./logs/${FILEDATE}_${FILENUMBER}.log" ]; do
          FILENUMBER=$((FILENUMBER+1))
      done
      mv ./logs/latest.log ./logs/${FILEDATE}_${FILENUMBER}.log
  fi
}

function trapint {
  log "${RED}Exiting...${RESET}"
  exit 0
}

function log {
  echo -e "$@" | tee /dev/fd/3
  echo -e "$@"
}

#setup functions
function setup_logs {
  if [ ! -d "./logs" ]; then
    mkdir ./logs
  fi
  exec 3>&1 1>>./logs/latest.log 2>&1
}

function setup_trapint {
  trap trapint SIGINT SIGTERM
}

# Service functions
function start {
  if [ ! -d "dist/" ]; then
    log "${RED}dist/ folder not found. Building...${RESET}"
    build
  fi

  if check_if_running; then
    log "${GREEN}Starting PixelClock...${RESET}"
    node ./src/index.js &
    PID=$!
    echo $PID > /var/run/pixelclock.pid
    log "${GREEN}PixelClock started with PID ${PID}.${RESET}"
  else
    log "${RED}PixelClock is already running.${RESET}"
  fi
}

function stop {
  if check_if_running; then
    log "${RED}PixelClock is not running.${RESET}"
  else
    log "${GREEN}Stopping PixelClock...${RESET}"
    kill -9 $PID
    rm /var/run/pixelclock.pid
    log "${GREEN}PixelClock stopped.${RESET}"
  fi
}

function restart {
  stop
  start
}

function status {
  if check_if_running; then
    log "${RED}PixelClock is not running.${RESET}"
  else
    log "${GREEN}PixelClock is running with PID ${PID}.${RESET}"
  fi
}

function install {

  if check_if_running; then
    log "${GREEN}Installing PixelClock...${RESET}"
    cp ./pixelclock.service /etc/systemd/system/pixelclock.service
    systemctl daemon-reload
    systemctl enable pixelclock.service
    log "${GREEN}PixelClock installed.${RESET}"
  else
    log "${RED}PixelClock is already running.${RESET}"
  fi
}

function uninstall {
  if check_if_running; then
    log "${GREEN}Uninstalling PixelClock...${RESET}"
    systemctl disable pixelclock.service
    rm /etc/systemd/system/pixelclock.service
    systemctl daemon-reload
    log "${GREEN}PixelClock uninstalled.${RESET}"
  else
    log "${RED}PixelClock is already running.${RESET}"
  fi
}

function usage {
  log "${WHITE}Usage: ${0} [ACTION] [FLAGS]${RESET}"
  log "${WHITE}Actions:${RESET}"
  log "${WHITE}  start${RESET} - Start the PixelClock service"
  log "${WHITE}  stop${RESET} - Stop the PixelClock service"
  log "${WHITE}  restart${RESET} - Restart the PixelClock service"
  log "${WHITE}  status${RESET} - Check the status of the PixelClock service"
  log "${WHITE}  install${RESET} - Install the PixelClock service"
  log "${WHITE}  uninstall${RESET} - Uninstall the PixelClock service"
  log "${WHITE}  update${RESET} - Update the PixelClock service"
  log ""
  log "${WHITE}Flags:${RESET}"
  log "${WHITE}  -q, --quiet${RESET} - Suppress all output"
  log "${WHITE}  -h, --help${RESET} - Show this help message"
  log "${WHITE}  -v, --version${RESET} - Show the version of PixelClock"
  log ""

  exit 0
}

function version {
  AUTHOR=$(git log -1 --format="%an")
  REPOSITORY=$(git config --get remote.origin.url)
  LAST_UPDATED=$(git log -1 --format="%cd")
  VERSION=$(git describe --tags --exact-match 2> /dev/null || git symbolic-ref -q --short HEAD || git rev-parse --short HEAD) # tag > branch > commit
  [[ "${VERSION}" == "main" ]] && VERSION="${GREEN}${VERSION}${RESET}" || VERSION="${RED}${VERSION}${RESET}"
  log "${WHITE}Version: ${VERSION}\nRepository: ${REPOSITORY}\nLast updated: ${LAST_UPDATED}‚\nAuthor: ${AUTHOR}"
  
  exit 0
}

function build {
  log "${GREEN}Building PixelClock...${RESET}"
  npm install || log "${RED}Failed to install dependencies.${RESET}"; exit 1
  npm run build || log "${RED}Failed to build PixelClock.${RESET}"; exit 1
  log "${GREEN}PixelClock built.${RESET}"
}

function update {
  log "${GREEN}Updating PixelClock...${RESET}"
  stop
  git reset --hard origin/main || log "${RED}Failed to reset to origin/main.${RESET}"; exit 1
  build
  start
  log "${GREEN}PixelClock updated.${RESET}"
}

function main {
  setup_trapint
  setup_logs

  show_banner

  if [[ "$1" == "" ]]; then
    usage $@
  fi

  if [[ "$@" == *"--version"* ]] && [[ "$@" == *"-v"* ]]; then
    version $@
  fi

  if [[ "$@" == *"--help"* ]] && [[ "$@" == *"-h"* ]]; then
    usage $@
  fi

  check_if_root

  if [[ "$@" != *"--no-updates"* ]] && [[ "$@" == *"-n"* ]]; then
    check_for_updates || update
  fi

  case "$1" in
    start)
      start $@
      ;;
    stop)
      stop $@
      ;;
    restart)
      restart $@
      ;;
    status)
      status $@
      ;;
    install)
      install $@
      ;;
    uninstall)
      uninstall $@
      ;;
    update)
      update $@
      ;;
    *)
      usage $@
      ;;
  esac
}

main $@; exit 0;