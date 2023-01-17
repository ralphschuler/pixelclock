#!/bin/bash
ACTION='\033[1;90m'
FINISHED='\033[1;96m'
READY='\033[1;92m'
NOCOLOR='\033[0m' # No Color
ERROR='\033[0;31m'

echo
echo -e ${ACTION}Checking Git repo
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
    echo -e ${ERROR}Not up to date with origin. Updating.${NOCOLOR}
    git reset --hard origin/main

    echo -e ${ACTION}Installing dependencies...${NOCOLOR}
    npm install

    echo -e ${ACTION}Building...${NOCOLOR}
    npm run build

    echo -e ${FINISHED}Restarting pixelclock...${NOCOLOR}
    $*
else
    echo -e ${FINISHED}Current branch is up to date with origin/main.${NOCOLOR}
    echo -e ${READY}Starting pixelclock...${NOCOLOR}
    sudo npm run dev
fi