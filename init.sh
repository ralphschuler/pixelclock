#!/bin/bash
if git pull; then
    echo "Updated pixelclock"
    npm install
    npm run build
    $*
else
    echo "Starting pixelclock"
    sudo node dist/index.js
fi