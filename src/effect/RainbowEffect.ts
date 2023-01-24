import { Matrix, IMatrixOptions, Color } from "../engine/matrix";
import { IDriver, IDriverOptions } from "../engine/matrix/driver";
import { IEffect, IEffectOptions } from "./IEffect";

const DEFAULT_COLORS = [
  Color.fromRgb(0, 255, 0),
]

export interface IRainbowEffect extends IEffectOptions {
  colors?: Color[],
  amount?: number
}

export class RainbowEffect extends IEffect<IRainbowEffect> {
  private colors: Color[] = DEFAULT_COLORS



  constructor(options: IRainbowEffect) {
    super(options)
    this.colors = options.colors || this.colors
  }
  
  public init(): void {}

  public update(): void {}

  public render(): void {
    this.matrix.clear(Color.fromRgb(0, 0, 0), 0.1)
    const time = Date.now() / 1000
    const amount = Math.random() * 15
    for (let i = 0; i < amount; i++) {
      const x = Math.floor(Math.random() * this.matrix.Width)
      const y = Math.floor(Math.random() * this.matrix.Height)
      const color = Color.fromHsl(
        (time + (x / this.matrix.Width) + (y / this.matrix.Height)) % 1,
        1,
        0.5
      )
      this.matrix.setPixel(x, y, color)
    }
    this.matrix.render()
  }

  public reset(): void {}
}