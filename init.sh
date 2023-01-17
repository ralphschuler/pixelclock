#!/bin/bash
if git pull; then
    echo "Updated pixelclock"
    echo "Installing dependencies"
    npm install
    echo "Building pixelclock"
    npm run build
    echo "Restarting pixelclock"
    $*
else
    echo "Starting pixelclock"
    sudo node dist/index.js
fi