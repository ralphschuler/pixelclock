
## Requirements
- 90X ws2812b leds (LED Strip)
- Raspberry Pi Zero W


## Installation
```bash
# configure raspberry pi


# install nodejs
wget https://unofficial-builds.nodejs.org/download/release/v19.4.0/node-v19.4.0-linux-armv6l.tar.gz
tar xvfz node-v19.4.0-linux-armv6l.tar.gz
sudo cp -R node-v19.4.0-linux-armv6l/* /usr/local/
rm -rf node-v19.4.0-linux-armv6l
rm node-v19.4.0-linux-armv6l.tar.gz

#NOTE: You may need to add node to your path manually. If so, run the following command:
echo "export PATH=$PATH:/usr/local/bin" >> ~/.bashrc

# install dependencies
sudo apt install python3 python3-pip python3-dev make gcc build-essential
sudo pip3 install rpi_ws281x

# clone the repo
git clone https://github.com/ralphschuler/pixelclock.git
git clone https://github.com/rpi-ws281x/rpi-ws281x-python.git # optional (example code in python)
cd pixelclock

```
## Features
- [ ] RGB Led matrix with higher resolution
- [ ] Buttons on top for custom actions
- [ ] usb type-c for power
- [ ] Clock Enclosure (https://www.instructables.com/Lazy-Mini-Grid/)
- [ ] speaker for audio feedback
- [ ] vibration motor for haptic feedback
- [ ] dedicated power button with backlight for visual feedback
- [ ] Web app with PWA capabilities for mobile support
- [ ] Microphone for audio/music visualization and maybe a custom AI assistant
- [ ] Sync multiple clocks with each other
- [ ] Custom stand (https://www.thingiverse.com/thing:1756573/files)

## Effects
- [ ] Matrix
- [ ] Falling Decay
- [ ] Faiding Decay
- [ ] Rainbow
- [ ] Fairy Lights
- [ ] Fire
- [ ] Fireworks
- [ ] Rain
- [ ] Snow
- [ ] Thunderstorm
- [ ] Lightning

## Animations
- [ ] Snake
- [ ] Tetris
- [ ] Pacman
- [ ] Pong


## Scenes
- [ ] Start up
- [ ] Update
- [ ] Clock
- [ ] Weather
- [ ] Audio visualizer
- [ ] Alarm clock
- [ ] AI assistant (maybe some animated eyes)
- [ ] Github activity
- [ ] Spotify now playing
