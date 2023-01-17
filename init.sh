#!/bin/bash

set -e

ACTION='\033[1;90m'
FINISHED='\033[1;96m'
READY='\033[1;92m'
NOCOLOR='\033[0m'
ERROR='\033[0;31m'

exec 3>&1 1>>./init.log 2>&1

trap trapint SIGINT SIGTERM
function trapint {
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ERROR}Caught SIGINT. Exiting...${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    exit 0
}

if (( $EUID != 0 )); then
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ERROR}Please run as root.${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    exit 1
fi

if npm run is-running; then
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${FINISHED}Pixelclock is running.${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
else
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ERROR}Pixelclock is not running.${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3

    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Starting pixelclock...${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    npm run start
fi


echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Checking for main branch...${NOCOLOR} | tee /dev/fd/3
echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ERROR}Not on main. Aborting update check.${NOCOLOR} | tee /dev/fd/3
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    exit 0
fi


while true; do
    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Checking for updates...${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ERROR}Not up to date with origin. Updating.${NOCOLOR} | tee /dev/fd/3

        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Resetting to origin/main...${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
        git reset --hard origin/main

        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Installing dependencies...${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
        npm install

        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Building pixelclock...${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
        npm run build

        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Restarting pixelclock... ${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
        npm run restart

        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Restarting parent process...${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
        exec ./init.sh
        exit 0
    else
        echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") ${FINISHED}Current branch is up to date with origin/main.${NOCOLOR} | tee /dev/fd/3
        echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    fi

    echo $(date "+%Y-%m-%d %H:%M:%S") | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") ${ACTION}Next update check in 5 minutes.${NOCOLOR} | tee /dev/fd/3
    echo -e $(date "+%Y-%m-%d %H:%M:%S") =======================${NOCOLOR} | tee /dev/fd/3
    sleep 300
done