import { Matrix } from "./Matrix";

function getPixelId(x: number, y: number) {
  let id = 0
  if (x % 2 === 0) {
    id = x / 2 + y * (width + 1);
  } else {
    id = width + 1 - x + x / 2 + y * (width + 1);
  }

  return Math.floor(id);
}

const height = 5;
const width = 17;
const matrix = new Matrix({
  height: height,
  width: width,
  ledCount: 90,
  getPixelId: getPixelId,
});

function fillScreen(color: number) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      matrix.setPixel(x, y, color);
      matrix.render();
    }
  }
}

function colorwheel(pos: number) {
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
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      matrix.setPixel(x, y, colorwheel((x + y) % 256));
      matrix.render();
      offset++;
    }
  }
}, 1000 / 30);
