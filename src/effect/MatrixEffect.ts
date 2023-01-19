import { Matrix, IMatrixOptions, Color } from "../engine/matrix";
import { IDriver, IDriverOptions } from "../engine/matrix/driver";
import { IEffect, IEffectOptions } from "./IEffect";

const DEFAULT_COLORS = [
  Color.fromRgb(255, 0, 0).darken(6),
  Color.fromRgb(255, 0, 0).darken(3),
  Color.fromRgb(255, 0, 0).darken(1),
  Color.fromRgb(255, 0, 0).darken(0.5),
  Color.fromRgb(255, 0, 0),
  Color.fromRgb(255, 0, 0).lighten(0.5),
  Color.fromRgb(255, 0, 0).lighten(1),
  Color.fromRgb(255, 0, 0).lighten(3),
  Color.fromRgb(255, 0, 0).lighten(6)
]

export interface IMatrixEffectOptions extends IEffectOptions {
  colors?: Color[],
  speed: number,
  direction: "up" | "down" | "left" | "right"
}

export class MatrixEffect<TMatrixEffectOptions extends IMatrixEffectOptions> extends IEffect<TMatrixEffectOptions> {
  private colors: Color[]
  private speed: number
  private direction: "up" | "down" | "left" | "right"

  private pixels: {
    x: number,
    y: number,
    color: Color
  }[] = []

  constructor(options: TMatrixEffectOptions) {
    console.debug('Matrix constructor')
    super(options)
    this.colors = options.colors || DEFAULT_COLORS
    this.speed = options.speed
    this.direction = options.direction
  }
  
  public init(): void {
    console.debug('Matrix init')
    for (let i = 0; i < 3; i++) {
      this.spawnPixel()
    }
  }

  public update(): void {
    console.debug('Matrix update')
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

    if (Math.random() < this.speed) {
      this.spawnPixel()
    }
  }

  public render(): void {
    console.debug('Matrix render')
    this.matrix.clear(Color.fromRgb(0, 0, 0))
    this.pixels.forEach(pixel => {
      this.matrix.setPixel(pixel.x, pixel.y, pixel.color)
    })
    this.matrix.render()
  }

  public reset(): void {
    console.debug('Matrix reset')
    this.pixels = []
  }

  private spawnPixel(): void {
    console.debug('Matrix spawnPixel')
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