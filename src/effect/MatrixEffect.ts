import { Matrix, IMatrixOptions, Color } from "../engine/matrix";
import { IDriver, IDriverOptions } from "../engine/matrix/driver";
import { IEffect, IEffectOptions } from "./IEffect";

const DEFAULT_COLORS = [
  Color.fromRgb(0, 200, 0).darken(6),
  Color.fromRgb(0, 200, 0).darken(3),
  Color.fromRgb(0, 200, 0).darken(1),
  Color.fromRgb(0, 200, 0).darken(0.5),
  Color.fromRgb(0, 200, 0),
  Color.fromRgb(0, 200, 0).lighten(0.5),
  Color.fromRgb(0, 200, 0).lighten(1),
  Color.fromRgb(0, 200, 0).lighten(3),
  Color.fromRgb(0, 200, 0).lighten(6)
]

export interface IMatrixEffectOptions extends IEffectOptions {
  colors?: Color[],
  speed: number,
  direction: "up" | "down" | "left" | "right"
  amount?: number
}

export class MatrixEffect extends IEffect<IMatrixEffectOptions> {
  private colors: Color[] = DEFAULT_COLORS
  private speed: number
  private direction: "up" | "down" | "left" | "right"
  private amount: number

  private pixels: {
    x: number,
    y: number,
    color: Color
  }[] = []

  constructor(options: IMatrixEffectOptions) {
    console.debug('MatrixEffect constructor')
    super(options)
    this.colors = options.colors || this.colors
    this.speed = options.speed
    this.direction = options.direction
    this.amount = options.amount || 5
  }
  
  public init(): void {
    console.debug('MatrixEffect init')
    for (let i = 0; i < 3; i++) {
      this.spawnPixel()
    }
  }

  public update(): void {
    console.debug('MatrixEffect update')
    this.pixels.forEach((pixel, index) => {
      switch (this.direction) {
        case "up":
          pixel.y--
          break
        case "down":
          pixel.y++
          break
        case "left":
          pixel.x--
          break
        case "right":
          pixel.x++
          break
      }

      if (pixel.x < 0 || pixel.x >= this.matrix.Width || pixel.y < 0 || pixel.y >= this.matrix.Height) {
        this.pixels.splice(index, 1)
        this.spawnPixel()
      }
    })
  }

  public render(): void {
    console.debug('MatrixEffect render')
    this.matrix.clear(Color.fromRgb(0, 0, 0))
    this.pixels.forEach(pixel => {
      this.matrix.setPixel(pixel.x, pixel.y, pixel.color)
    })
    this.matrix.render()
  }

  public reset(): void {
    console.debug('MatrixEffect reset')
    this.pixels = []
  }

  private spawnPixel(): void {
    console.debug('MatrixEffect spawnPixel')
    const x = Math.floor(Math.random() * this.matrix.Width)
    const y = Math.floor(Math.random() * this.matrix.Height)
    const color = this.colors[Math.floor(Math.random() * this.colors.length)]

    this.pixels.push({
      x,
      y,
      color
    })
  }
}