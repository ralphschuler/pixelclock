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

function rgbToHex(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b;
}

fillScreen(rgbToHex(255, 155, 55));