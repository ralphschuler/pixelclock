import { Matrix, IMatrixOptions, Color } from "../engine/matrix";
import { IDriver, IDriverOptions } from "../engine/matrix/driver";
import { IEffect, IEffectOptions } from "./IEffect";

const DEFAULT_COLORS = [
  Color.fromRgb(0, 255, 0),
]

export interface IMatrixEffectOptions extends IEffectOptions {
  colors?: Color[],
  speed: number,
  direction?: "up" | "down" | "left" | "right"
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
    this.direction = options.direction || "down"
    this.amount = options.amount || 5
  }
  
  public init(): void {
    console.debug('MatrixEffect init')
    for (let i = 0; i < this.amount; i++) {
      this.checkPixelAmount(5, 15)
    }
  }

  public update(): void {
    Math.random() < 0.15 && this.checkPixelAmount(5, 30)

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

        if (Math.random() < 0.75) {
          this.spawnPixel()
        }
      }
    })
  }

  public render(): void {
    console.debug('MatrixEffect render')
    this.matrix.clear(Color.fromRgb(0, 0, 0), 0.1)
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
    let x = 0
    let y = 0
    switch (this.direction) {
      case "up":
        x = Math.floor(Math.random() * this.matrix.Width)
        break
      case "down":
        x = Math.floor(Math.random() * this.matrix.Width)
        break
      case "left":
        y = Math.floor(Math.random() * this.matrix.Height)
        break
      case "right":
        y = Math.floor(Math.random() * this.matrix.Height)
        break
    }

    this.pixels.push({
      x: x,
      y: y,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    })
  }

  //a function which checks if the amount of pixels is in a given range and spawns new ones if not
  private checkPixelAmount(min: number, max: number) {
    if (this.pixels.length < min) {
      const maxSpawn = Math.min(min - this.pixels.length, max - this.pixels.length)
      const spawn = Math.floor(Math.random() * maxSpawn) + 1
      for (let i = 0; i < spawn; i++) {
        this.spawnPixel()
      }
    } else if (this.pixels.length > max) {
      for (let i = 0; i < this.pixels.length - max; i++) {
        this.pixels.splice(Math.floor(Math.random() * this.pixels.length), 1)
      }
    }
  }
}