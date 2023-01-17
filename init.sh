#!/bin/bash
ACTION='\033[1;90m'
FINISHED='\033[1;96m'
READY='\033[1;92m'
NOCOLOR='\033[0m'
ERROR='\033[0;31m'

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>init.log 2>&1

if (( $EUID != 0 )); then
    echo
    echo -e ${ERROR}Please run as root.${NOCOLOR}
    echo -e =======================${NOCOLOR}
    exit 1
fi

if npm run is-running; then
    echo
    echo -e ${FINISHED}Pixelclock is running.${NOCOLOR}
    echo -e =======================${NOCOLOR}
else
    echo
    echo -e ${ERROR}Pixelclock is not running.${NOCOLOR}
    echo -e =======================${NOCOLOR}

    echo
    echo -e ${ACTION}Starting pixelclock...${NOCOLOR}
    echo -e =======================${NOCOLOR}
    npm run start
fi


echo
echo -e ${ACTION}Checking for main branch...${NOCOLOR}
echo -e =======================${NOCOLOR}
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo -e ${ERROR}Not on main. Aborting update check.${NOCOLOR}
    echo
    exit 0
fi


while true; do
    echo
    echo -e ${ACTION}Checking for updates...${NOCOLOR}
    echo -e =======================${NOCOLOR}
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse main@{upstream})
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        echo -e ${ERROR}Not up to date with origin. Updating.${NOCOLOR}

        echo
        echo -e ${ACTION}Resetting to origin/main...${NOCOLOR}
        echo -e =======================${NOCOLOR}
        git reset --hard origin/main

        echo
        echo -e ${ACTION}Installing dependencies...${NOCOLOR}
        echo -e =======================${NOCOLOR}
        npm install

        echo
        echo -e ${ACTION}Building pixelclock...${NOCOLOR}
        echo -e =======================${NOCOLOR}
        npm run build

        echo
        echo -e ${ACTION}Restarting pixelclock... ${NOCOLOR}
        echo -e =======================${NOCOLOR}
        npm run restart
    else
        echo
        echo -e ${FINISHED}Current branch is up to date with origin/main.${NOCOLOR}
        echo -e =======================${NOCOLOR}
    fi

    echo
    echo -e ${ACTION}Next update check in 5 minutes.${NOCOLOR}
    echo -e =======================${NOCOLOR}
    sleep 300
done