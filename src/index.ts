import { Matrix } from "./Matrix";

const rows = 5;
const columns = 17;
const matrix = new Matrix({
  rows: rows,
  columns: columns,
  ledCount: 90,
  getPixelId: (x, y) => {
    if (x % 2 === 0) {
      return x / 2 + y * (rows + 1);
    } else {
      return rows + 1 - x + x / 2 + y * (rows + 1);
    }
  },
});

function fillScreen(color: number) {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      matrix.setPixel(x, y, color);
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

let offset = 0;
setInterval(() => {
  console.log(new Date().toISOString(), "loop");
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      matrix.setPixel(x, y, colorwheel((x * y + offset) % 256));
      offset++;
    }
  }
}, 1000 / 30);
