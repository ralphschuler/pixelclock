import ws281x from "rpi-ws281x-native";
import { Matrix } from "./Matrix";

const FRAMES_PER_SECOND = 5;

function getPixelIdByXY(x: number, y: number) {
  let id = 0
  if (x % 2 === 0) {
    id = x / 2 + y * (width + 1);
  } else {
    id = width + 1 - x + x / 2 + y * (width + 1);
  }

  return Math.floor(id);
}

function getPixelXYById(id: number) {
  const x = Math.floor(id / (height + 1)) * 2;
  const y = id % (height + 1);

  return { x, y };
}

function intToRgb(color: number) {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  return { r, g, b };
}

function blendColors(from: number, to: number): number {
  const fromColor = intToRgb(from);
  const toColor = intToRgb(to);

  const r = Math.floor((fromColor.r + toColor.r) / 2);
  const g = Math.floor((fromColor.g + toColor.g) / 2);
  const b = Math.floor((fromColor.b + toColor.b) / 2);

  return rgbToInt(r, g, b);
}

const height = 5;
const width = 17;
const matrix = new Matrix({
  height: height,
  width: width,
  ledCount: 90,
  getPixelId: getPixelIdByXY,
});

function fillScreen(color: number) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const currentColor = matrix.getPixel(x, y);
      matrix.setPixel(x, y, blendColors(currentColor, color));
    }
  }
  matrix.render();
}

function colorWheel(pos: number) {
  pos = 255 - pos;

  if (pos < 85) {
    return rgbToInt(255 - pos * 3, 0, pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    return rgbToInt(0, pos * 3, 255 - pos * 3);
  } else {
    pos -= 170;
    return rgbToInt(pos * 3, 255 - pos * 3, 0);
  }
}

function rgbToInt(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b;
}

console.log("Starting...");
console.log("Press Ctrl+C to exit.");

let offset = 0;
setInterval(() => {
  fillScreen(rgbToInt(0, 0, 0))
  for (let i = 0; i < 25; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    matrix.setPixel(x, y, colorWheel(((x * y) * offset) % 256));
    matrix.render();
    offset++;
  }
}, 1000 / FRAMES_PER_SECOND);

process.on('SIGINT', function() {
  ws281x.reset();
  ws281x.finalize();
  process.nextTick(function() { process.exit(0); });
})

process?.send &&  process.send('ready')