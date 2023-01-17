#!/bin/bash

git_had_update=$(git pull 2>&1 | grep -c 'Already up-to-date')

if [ $git_had_update -ne 0 ]; then
    echo "Updated pixelclock"
    $*
else
    echo "Starting pixelclock"
    sudo node dist/index.js
fi