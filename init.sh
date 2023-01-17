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
if [ "$BRANCH" != "master" ]; then
    echo -e ${ERROR}Not on master. Aborting. ${NOCOLOR}
    echo
    exit 0
fi

git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse master@{upstream})

if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
    echo -e ${ERROR}Not up to date with origin. Updating.${NOCOLOR}
    git reset --hard origin/master
    git pull

    npm install
    npm run build

    $*
else
    echo -e ${FINISHED}Current branch is up to date with origin/master.${NOCOLOR}
    sudo npm run dev
fi