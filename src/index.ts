import { IMatrixEffectOptions, MatrixEffect } from './effect';
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
    console.debug('getPixelId', x, y)
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

const matricsEffect = new MatrixEffect({
  matrix: matrix,
  speed: 100,
  direction: "up"
})
matricsEffect.init()

const loop = () => {
  console.debug('loop')
  matricsEffect.update()
  matricsEffect.render()
}

setInterval(loop, 1000)

