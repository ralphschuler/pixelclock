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
exec 3>&1 1>>./init.log 2>&1
function log {
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S")${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S")${RESET} $1$2${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S") ${GREY}=======================${RESET}" | tee /dev/fd/3
}

# Traps
trap trapint SIGINT SIGTERM
function trapint {
    log ${RED} "Caught SIGINT. Exiting..."
    exit 0
}

# Check if root
if (( $EUID != 0 )); then
    log ${RED} "Please run as root."
    exit 1
fi

# Respond to --help and -h (if set, show the help message and exit)
if [[ "$@" == *"--help"* ]] && [[ "$@" == *"-h"* ]]; then
    log ${WHITE} "You can use the following arguments: --help, -h: Show this help message \n--quiet, -q: Don't show the logo \n--version, -v: Show the version"
    exit 0
fi

# Respond to --version and -v (if set, show the version and exit)
REPOSITORY=$(git config --get remote.origin.url)
VERSION=$(git describe --tags --exact-match 2> /dev/null || git symbolic-ref -q --short HEAD || git rev-parse --short HEAD) # tag > branch > commit
if [[ "$@" == *"--version"* ]] && [[ "$@" == *"-v"* ]]; then
    log ${WHITE} "version: ${VERSION}\nrepository: ${REPOSITORY}"
    exit 0
fi

# Respond to --quiet and -q (if set, don't show the logo and continue)
if [[ "$@" != *"--quiet"* ]] && [[ "$@" != *"-q"* ]]; then
    echo -e "${WHITE}===================================================${RESET}" | tee /dev/fd/3
    echo -e "${GREY} _____ ${RED}_${RESET}          _    _____ _            _    ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|  __ ${RED}(_)${RESET}        | |  / ____| |          | |   ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}| |__) |${CYAN}__  __${RESET}___| | | |    | | ${PURPLE}___${RESET}   ___| | __${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|  ___/ ${CYAN}\ \/ /${RESET} _ \ | | |    | |${PURPLE}/ _ \\\\${RESET} / __| |/ /${RESET}" | tee /dev/fd/3
    echo -e "${GREY}| |   | ${CYAN}|>  < ${RESET} __/ | | |____| |${PURPLE} (_) |${RESET} (__|   < ${RESET}" | tee /dev/fd/3
    echo -e "${GREY}|_|   |_${CYAN}/_/\_\\\\${RESET}___|_|  \_____|_|${PURPLE}\___/${RESET} \___|_|\_\\\\${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}===================================================${RESET}" | tee /dev/fd/3

    log ${GREY} "version: ${VERSION} | startup: $(date "+%Y-%m-%d %H:%M:%S") | pid: $$${RESET}"
fi

log ${WHITE} "Checking if pixelclock is running..."
if yarn is-running; then
    log ${GREEN} "Pixelclock is already running."
else
    log ${YELLOW} "Pixelclock is not running. Starting..."
    yarn start
fi


log ${WHITE} "Checking if on main branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    log ${RED} "Only the main branch can be updated by this script. Exiting..."
    exit 0
fi


while true; do
    log ${WHITE} "Checking if up to date with origin/main..."
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        log ${YELLOW} "Current branch is not up to date with origin/main. Updating..."

        log ${WHITE} "Resetting to origin/main..."
        git reset --hard origin/main

        log ${WHITE} "Installing dependencies..."
        yarn

        log ${WHITE} "Building pixelclock..."
        yarn build

        log ${WHITE} "Creating service..."
        yarn startup

        log ${WHITE} "Saving pm2 config..."
        yarn save

        log ${WHITE} "Restarting pixelclock..."
        yarn restart
        exec ./init.sh
        exit 0
    else
        log ${GREEN} "Current branch is up to date with origin/main."
    fi

    log ${WHITE} "Next update check in 5 minutes."
    sleep 300
done