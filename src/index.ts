import { Color, Driver, Matrix } from './engine/matrix'

const matrixWidth = 17
const matrixHeight = 5
const ledCount = 90
const matrix = new Matrix({
  width: matrixWidth,
  height: matrixHeight,
  driver: Driver.WS281x,
  driverOptions: {
    ledCount: ledCount,
    gpio: 18,
    dma: 10,
    frequency: 800000,
    invert: false,
    brightness: 255,
    stripType: 'WS2812'
  },
  getPixelId: (x: number, y: number) => {
    let id = 0
    if (x % 2 === 0) {
      id = x / 2 + y * (matrixWidth + 1);
    } else {
      id = matrixWidth + 1 - x + x / 2 + y * (matrixWidth + 1);
    }

    return Math.floor(id);
  }
});


setInterval(() => {
  matrix.clear(Color.fromRandom())
  matrix.render()
  for (let x = 0; x < matrixWidth; x++) {
    for (let y = 0; y < matrixHeight; y++) {
      matrix.setPixel(x, y, Color.fromRandom())
      matrix.render()
    }
  }
}, 1000)