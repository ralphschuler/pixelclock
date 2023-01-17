#!/bin/bash

set -e

# Formatting
WHITE='\033[0;37m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
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

echo $(npm run is-running)
echo $?

log ${WHITE} "Checking if pixelclock is running..."
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