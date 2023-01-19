import { Color } from "../Color"

export interface IDriverOptions {
  ledCount: number
}

export abstract class IDriver<TDriverOptions extends IDriverOptions> {
  public readonly ledCount: number

  protected pixelData: Buffer

  public constructor(options: TDriverOptions) {
    console.debug("IDriver constructor")
    this.ledCount = options.ledCount
    this.pixelData = Buffer.alloc(this.ledCount)
  }

  public abstract init(): void
  public abstract flush(): void
  public abstract render(): void
  public abstract reset(): void

  public set PixelData(data: Buffer) {
    console.debug("IDriver set PixelData", data)
    this.pixelData = data
  }
  public get PixelData(): Buffer {
    console.debug("IDriver get PixelData")
    return this.pixelData
  }

  public setPixel(index: number, color: Color) {
    console.debug("IDriver setPixel", index, color)
    this.pixelData.writeUInt32LE(color.valueOf(), index)
  }

  public getPixel(index: number): Color {
    console.debug("IDriver getPixel", index)
    return new Color(this.pixelData[index])
  }
}