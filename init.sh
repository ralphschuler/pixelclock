#!/bin/bash

set -e
set -o pipefail
set -u

ACTION='\033[1;90m'
FINISHED='\033[1;96m'
READY='\033[1;92m'
NOCOLOR='\033[0m'
ERROR='\033[0;31m'

exec 3>&1 1>>./init.log 2>&1
function log {
    echo -e "$(date "+%Y-%m-%d %H:%M:%S")" | tee /dev/fd/3
    echo -e "$(date "+%Y-%m-%d %H:%M:%S") $1$2${NOCOLOR}" | tee /dev/fd/3
    echo -e "$(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR}" | tee /dev/fd/3
}

trap trapint SIGINT SIGTERM
function trapint {
    log ${ERROR} "Caught SIGINT. Exiting..."
    exit 0
}

if (( $EUID != 0 )); then
    log ${ERROR} "Please run as root."
    exit 1
fi

if npm run is-running ; then
    log ${FINISHED} "Pixelclock is already running."
else
    log ${ERROR} "Pixelclock is not running. Starting..."
    npm run start
fi


log ${ACTION} "Checking if on main branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    log ${ERROR} "Only the main branch can be updated by this script. Exiting..."
    exit 0
fi


while true; do
    log ${ACTION} "Checking if up to date with origin/main..."
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        log ${ERROR} "Current branch is not up to date with origin/main. Updating..."

        log ${ACTION} "Resetting to origin/main..."
        git reset --hard origin/main

        log ${ACTION} "Installing dependencies..."
        npm install

        log ${ACTION} "Building pixelclock..."
        npm run build

        log ${ACTION} "Restarting pixelclock..."
        npm run restart
        exec ./init.sh
        exit 0
    else
        log ${FINISHED} "Current branch is up to date with origin/main."
    fi

    log ${ACTION} "Next update check in 5 minutes."
    sleep 300
done