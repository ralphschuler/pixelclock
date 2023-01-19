import { Color } from "../Color"

export interface IDriverOptions {
  ledCount: number
}
export abstract class IDriver<TDriverOptions extends IDriverOptions> {
  public readonly ledCount: number

  protected pixelData: Uint32Array

  public constructor(options: TDriverOptions) {
    console.debug("IDriver constructor")
    this.ledCount = options.ledCount
    this.pixelData = new Uint32Array(this.ledCount)
  }

  public abstract init(): void
  public abstract flush(): void
  public abstract render(): void
  public abstract reset(): void

  public set PixelData(data: Uint32Array) {
    console.debug("IDriver set PixelData", data)
    this.pixelData = data
  }
  public get PixelData(): Uint32Array {
    console.debug("IDriver get PixelData")
    return this.pixelData
  }

  public setPixel(index: number, color: Color) {
    console.debug("IDriver setPixel", index, color)
    this.pixelData[index] = color.valueOf()
  }

  public getPixel(index: number): Color {
    console.debug("IDriver getPixel", index)
    return new Color(this.pixelData[index])
  }
}