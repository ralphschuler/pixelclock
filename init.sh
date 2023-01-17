#!/bin/bash
ACTION='\033[1;90m'
FINISHED='\033[1;96m'
READY='\033[1;92m'
NOCOLOR='\033[0m' # No Color
ERROR='\033[0;31m'

echo
echo -e ${ACTION}Checking for updates...
echo -e =======================${NOCOLOR}
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo -e ${ERROR}Not on main. Aborting. ${NOCOLOR}
    echo
    exit 0
fi

git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse main@{upstream})

if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
    echo -e ${ERROR}Not up to date with origin. Updating.
    echo
    echo -e =======================${NOCOLOR}
    git reset --hard origin/main

    echo
    echo -e ${ACTION}Installing dependencies...
    echo -e =======================${NOCOLOR}
    npm install

    echo
    echo -e ${ACTION}Building...
    echo -e =======================${NOCOLOR}
    npm run build

    echo
    echo -e ${FINISHED}Restarting pixelclock...
    echo -e =======================${NOCOLOR}
    exec "$*"
else
    echo -e ${FINISHED}Current branch is up to date with origin/main.${NOCOLOR}
    echo
    echo -e ${READY}Starting pixelclock...
    echo -e =======================${NOCOLOR}
    sudo npm run start
fi