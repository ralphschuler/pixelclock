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

(async () => {
    
  const loop = () => {
    for (let r = 0; r < 256; r++) {
      for (let g = 0; g < 256; g++) {
        for (let b = 0; b < 256; b++) {
          fillScreen(rgbToHex(r, g, b));
          matrix.render();
        }
      }
    }
  }

  setInterval(loop, 1000 / 30);

})();