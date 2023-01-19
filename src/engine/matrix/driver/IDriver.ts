import { Color } from "../Color"

export interface IDriverOptions {
  ledCount: number
}
export abstract class IDriver {
  public readonly ledCount: number

  protected pixelData: Buffer

  public constructor(options: IDriverOptions) {
    this.ledCount = options.ledCount
    this.pixelData = Buffer.alloc(this.ledCount)
  }

  public abstract init(): void
  public abstract flush(): void
  public abstract render(): void
  public abstract reset(): void

  public set PixelData(data: Buffer) {
    this.pixelData = data
  }
  public get PixelData(): Buffer {
    return this.pixelData
  }

  public setPixel(index: number, color: Color) {
    this.pixelData.writeUInt32LE(color.valueOf(), index)
  }

  public getPixel(index: number): Color {
    return new Color(this.pixelData.readUInt32LE(index))
  }
}