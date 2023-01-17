#!/bin/bash

git pull --dry-run | grep -q -v 'Already up-to-date.' && updated=1 || updated=0

if [ $updated -eq 1 ]; then
    echo "Updated pixelclock"
    echo "Installing dependencies"
    npm install
    echo "Building pixelclock"
    npm run build
    echo "Restarting pixelclock"
    $*
else
    echo "Starting pixelclock"
    sudo npm run dev
fi