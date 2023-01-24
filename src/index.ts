import { RainbowEffect } from './effect/RainbowEffect';
import { Color, Driver, Matrix } from './engine/matrix'
import { WS281x, IWS281xOptions, StripType } from './engine/matrix/driver';

const matrixWidth = 17
const matrixHeight = 5
const ledCount = 90
const options = {
  ledCount: ledCount,
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
    stripType: "WS2812" as StripType,
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
}
const matrix = new Matrix<WS281x<IWS281xOptions>, IWS281xOptions>(options);

const colorAmount = 5
const rainbowEffect = new RainbowEffect({
  colors: [...new Array(colorAmount)].map((_, index) =>
    colorWheel((index * 256 / colorAmount) % 256)
  ),
  matrix: matrix
})
rainbowEffect.init()

const loop = () => {
  console.debug('Main Loop')
  rainbowEffect.update()
  rainbowEffect.render()

  setTimeout(loop, 300)
}

loop()

function colorWheel(pos: number) {
  if (pos < 85) {
    return Color.fromRgb(pos * 3, 255 - pos * 3, 0);
  } else if (pos < 170) {
    pos -= 85;
    return Color.fromRgb(255 - pos * 3, 0, pos * 3);
  } else {
    pos -= 170;
    return Color.fromRgb(0, pos * 3, 255 - pos * 3);
  }
}