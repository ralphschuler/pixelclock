import { Color } from "./Color";
import { IDriver, IDriverOptions } from "./driver";

export interface IMatrixOptions<TDriver extends IDriver<TDriverOptions>, TDriverOptions extends IDriverOptions> {
  width: number;
  height: number;
  driver: new (options: TDriverOptions) => TDriver;
  driverOptions: TDriverOptions;
  getPixelId?: (x: number, y: number) => number;
}

export class Matrix<TDriver extends IDriver<TDriverOptions>, TDriverOptions extends IDriverOptions> {

  private readonly width: number;
  private readonly height: number;
  private readonly driver: TDriver;

  protected getPixelId: (x: number, y: number) => number = (x, y) => {
    return y * this.width + x;
  }

  constructor(options: IMatrixOptions<TDriver, TDriverOptions>) {
    this.width = options.width;
    this.height = options.height;
    this.driver = new options.driver(options.driverOptions);
    this.getPixelId = options.getPixelId || this.getPixelId;

    this.driver.init();
  }

  public get Width(): number {
    return this.width;
  }
  public get Height(): number {
    return this.height;
  }

  public setPixel(x: number, y: number, color: Color) {
    this.driver.setPixel(this.getPixelId(x, y), color);
  }

  public getPixel(x: number, y: number): Color {
    return this.driver.getPixel(this.getPixelId(x, y));
  }

  public render(): void {
    this.driver.flush();
    this.driver.render();
  }

  public reset(): void {
    this.driver.reset();
  }

  public clear(color: Color, blendAmount: number = 100): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const currentColor = this.getPixel(x, y);
        this.setPixel(x, y, currentColor.blend(color, blendAmount));
      }
    }
    this.render();
  } 
}