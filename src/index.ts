import { Color } from './engine/matrix/Color'
import { WS281x } from './engine/matrix/driver/WS281x'
import { Matrix } from './matrix'

const matrixWidth = 17
const matrixHeight = 5
const matrix = new Matrix({
  width: matrixWidth,
  height: matrixHeight,
  leds: 90,
  driver: WS281x,
  driverOptions: {
    gpio: 18,
    dma: 10,
    frequency: 800000,
    invert: false,
    brightness: 255,
    stripType: 'ws281x'
  },
  getPixelIdByPosition: (x: number, y: number) => {
    let id = 0
    if (x % 2 === 0) {
      id = x / 2 + y * (matrixWidth + 1);
    } else {
      id = matrixWidth + 1 - x + x / 2 + y * (matrixWidth + 1);
    }

    return Math.floor(id);
  },
  getPixelPositionById: (id: number) => {
    return {
      x: id % 17,
      y: Math.floor(id / 17),
    }
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