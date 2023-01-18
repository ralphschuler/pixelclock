#!/bin/bash

set -e

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


exec 3>&1 1>>./init.log 2>&1
function log {
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S")${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S")${RESET} $1$2${RESET}" | tee /dev/fd/3
    echo -e "${WHITE}$(date "+%Y-%m-%d %H:%M:%S") =======================${RESET}" | tee /dev/fd/3
}

trap trapint SIGINT SIGTERM
function trapint {
    log ${RED} "Caught SIGINT. Exiting..."
    exit 0
}

if (( $EUID != 0 )); then
    log ${RED} "Please run as root."
    exit 1
fi

if [[ $- == *i* ]]
then
    echo -e "${BLACK}${BG_PURPLE}  _ \\${RESET} ${BLACK}${BG_ORANGE}_)${RESET}${BLACK}${BG_GREEN}${RESET}      ${BLACK}${BG_BLUE}${RESET}     ${BLACK}${BG_YELLOW}${RESET}     ${BLACK}${BG_RED} |${RESET}${BLACK}${BG_CYAN}  ___|${RESET}${BLACK}${BG_GREEN} |${RESET}${BLACK}${BG_PURPLE}${RESET}      ${BLACK}${BG_YELLOW}${RESET}     ${BLACK}${BG_BLUE} |${RESET}" 1>&3
    echo -e "${BLACK}${BG_PURPLE} |   |${RESET}${BLACK}${BG_ORANGE} |${RESET}${BLACK}${BG_GREEN}\\ \\  /${RESET}${BLACK}${BG_BLUE}  __|${RESET}${BLACK}${BG_YELLOW}  _ \\${RESET}${BLACK}${BG_RED} |${RESET}${BLACK}${BG_CYAN} |${RESET}    ${BLACK}${BG_GREEN} |${RESET}${BLACK}${BG_PURPLE}  _ \\${RESET} ${BLACK}${BG_YELLOW}  __|${BLACK}${BG_BLUE} |  /${RESET}" 1>&3
    echo -e "${BLACK}${BG_PURPLE} ___/${RESET} ${BLACK}${BG_ORANGE} |${RESET} ${BLACK}${BG_GREEN}\`  <${RESET} ${BLACK}${BG_BLUE} (${RESET}   ${BLACK}${BG_YELLOW}  __/${RESET}${BLACK}${BG_RED} |${RESET}${BLACK}${BG_CYAN} |${RESET}    ${BLACK}${BG_GREEN} |${RESET}${BLACK}${BG_PURPLE} (   |${BLACK}${BG_YELLOW} (${RESET}   ${BLACK}${BG_BLUE}   <${RESET}" 1>&3
    echo -e "${BLACK}${BG_PURPLE}_|${RESET}    ${BLACK}${BG_ORANGE}_|${RESET} ${BLACK}${BG_GREEN}_/\\_\\${RESET}${BLACK}${BG_BLUE}\\___|${RESET}${BLACK}${BG_YELLOW}\\___|${RESET}${BLACK}${BG_RED}_|${RESET}${BLACK}${BG_CYAN}\\____|${RESET}${BLACK}${BG_GREEN}_|${RESET}${BLACK}${BG_PURPLE}\\___/${RESET} ${BLACK}${BG_YELLOW}\\___|${RESET}${BLACK}${BG_BLUE}_|\\_\\\\${RESET}" 1>&3

    log ${WHITE} "Pixelclock init script."
fi

VERSION=$(git describe --tags --exact-match 2> /dev/null || git symbolic-ref -q --short HEAD || git rev-parse --short HEAD) # tag > branch > commit
log ${WHITE} "Pixelclock version ${VERSION}."

log ${WHITE} "Checking if pixelclock is running..."
log ${BMAGENTA} "npm run is-running == '$(npm run is-running)'" # DEBUG
if npm run is-running; then
    log ${GREEN} "Pixelclock is already running."
else
    log ${YELLOW} "Pixelclock is not running. Starting..."
    npm run start
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
        npm install

        log ${WHITE} "Building pixelclock..."
        npm run build

        log ${WHITE} "Restarting pixelclock..."
        npm run restart
        exec ./init.sh
        exit 0
    else
        log ${GREEN} "Current branch is up to date with origin/main."
    fi

    log ${WHITE} "Next update check in 5 minutes."
    sleep 300
done