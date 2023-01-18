#!/bin/bash

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

# Logging
if [ ! -d "./logs" ]; then
    mkdir ./logs
fi

# Rotate logs
if [ -f "./logs/latest.log" ]; then
    FILEDATE=$(date -r ./logs/latest.log "+%Y-%m-%d")
    FILENUMBER=0
    while [ -f "./logs/${FILEDATE}_${FILENUMBER}.log" ]; do
        FILENUMBER=$((FILENUMBER+1))
    done
    mv ./logs/latest.log ./logs/${FILEDATE}_${FILENUMBER}.log
fi


exec 3>&1 1>>./logs/latest.log 2>&1
function log {
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S")${RESET}" | tee /dev/fd/3
    echo -e "$1$2${RESET}" | tee /dev/fd/3
    echo -e "${GREY} =======================${RESET}" | tee /dev/fd/3
}

# Traps
trap trapint SIGINT SIGTERM
function trapint {
    log ${RED} "Caught SIGINT or SIGTERM.\nExiting..."
    exit 0
}

# Check if root
if (( $EUID != 0 )); then
    log ${RED} "This script must be run as root.\nExiting..."
    exit 1
fi

# Respond to --help and -h (if set, show the help message and exit)
if [[ "$@" == *"--help"* ]] && [[ "$@" == *"-h"* ]]; then
    log ${WHITE} "You can use the following arguments:\n\t--help,\t-h\tShow this help message.\t\n--quiet,\t-q\nDon't show the logo.\n\t--version, \t-v\tShow the version and exit."
    exit 0
fi

# Respond to --version and -v (if set, show the version and exit)
AUTHOR=$(git log -1 --format="%an")
REPOSITORY=$(git config --get remote.origin.url)
LAST_UPDATED=$(git log -1 --format="%cd")
VERSION=$(git describe --tags --exact-match 2> /dev/null || git symbolic-ref -q --short HEAD || git rev-parse --short HEAD) # tag > branch > commit
if [[ "$@" == *"--version"* ]] && [[ "$@" == *"-v"* ]]; then
    log ${WHITE} "\tVersion: ${VERSION}\n\tRepository: ${REPOSITORY}\n\tLast updated: ${LAST_UPDATED}‚\n\tAuthor: ${AUTHOR}"
    exit 0
fi

# Respond to --quiet and -q (if set, don't show the logo and continue)
if [[ "$@" != *"--quiet"* ]] && [[ "$@" != *"-q"* ]]; then
    echo -e "${WHITE}===================================================${RESET}" | tee /dev/fd/3
    echo -e "${GREY} _____ ${RED}_${RESET}         ${BLUE} _${RESET}    _____ ${GREY}_           ${RESET}${RED} _    ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|  __ ${RED}(_)${RESET}        ${BLUE}| |${RESET}  / ____|${GREY} |          ${RESET}${RED}| |   ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}| |__) |${CYAN}__  __${RESET}___${BLUE}| |${RESET} | |    ${GREY}| | ${RESET}${PURPLE}___${RESET}  ${CYAN} ___${RED}| | __${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|  ___/ ${CYAN}\ \/ /${RESET} _ \\\\${BLUE} |${RESET} | |    ${GREY}| |${RESET}${PURPLE}/ _ \\\\${RESET} ${CYAN}/ __|${RED} |/ /${RESET}" | tee /dev/fd/3
    echo -e "${GREY}| |   | ${CYAN}|>  < ${RESET} __/${BLUE} | |${RESET} |____${GREY}| |${RESET}${PURPLE} (_) |${RESET} ${CYAN}(__|${RED}   < ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|_|   |_${CYAN}/_/\_\\\\${RESET}___${BLUE}|_|${RESET}  \_____|${GREY}_|${RESET}${PURPLE}\___/${RESET} ${CYAN}\___|${RED}_|\_\\\\${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}===================================================${RESET}" | tee /dev/fd/3
fi
log ${WHITE} "Initializing..."
log ${GREY} "Version: ${VERSION} | Startup: $(date "+%Y-%m-%d %H:%M:%S") | PID: $$${RESET}"

log ${WHITE} "Check service status..."
if yarn is-running; then
    log ${GREEN} "Service is running."
else
    log ${YELLOW} "Service is not running.\nStarting..."
    yarn start
fi


log ${WHITE} "Checking for main branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    log ${RED} "Only the main branch can be updated. Exiting..."
    exit 0
fi


while true; do
    log ${WHITE} "Checking for updates..."
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        log ${YELLOW} "Update found.\nUpdating..."

        log ${WHITE} "Pulling latest changes..."
        git reset --hard origin/main

        log ${WHITE} "Installing dependencies..."
        yarn install --ci

        log ${WHITE} "Building service..."
        yarn build

        log ${WHITE} "Creating service..."
        yarn startup

        log ${WHITE} "Saving pm2 config..."
        yarn save

        log ${WHITE} "Restarting service..."
        yarn restart
        exec "$0" "$@"
    else
        log ${GREEN} "No updates found."
    fi

    log ${WHITE} "Waiting 60 seconds..."
    sleep 60
done