import { Color } from "../Color"

export interface IDriverOptions {
  ledCount: number
}

export abstract class IDriver<TDriverOptions extends IDriverOptions> {
  public readonly ledCount: number

  protected pixelData: number[]

  public constructor(options: TDriverOptions) {
    this.ledCount = options.ledCount
    this.pixelData = []
  }

  public abstract init(): void
  public abstract flush(): void
  public abstract render(): void
  public abstract reset(): void

  public set PixelData(data: number[]) {
    this.pixelData = data
  }
  public get PixelData(): number[] {
    return this.pixelData
  }

  public setPixel(index: number, color: Color) {
    this.pixelData[index] = color.valueOf()
  }

  public getPixel(index: number): Color {
    return new Color(this.pixelData[index])
  }
}