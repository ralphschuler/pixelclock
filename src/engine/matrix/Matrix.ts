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
    console.debug('Matrix default getPixelId', x, y);
    return y * this.width + x;
  }

  constructor(options: IMatrixOptions<TDriver, TDriverOptions>) {
    console.debug('Matrix constructor');
    this.width = options.width;
    this.height = options.height;
    this.driver = new options.driver(options.driverOptions);
    this.getPixelId = options.getPixelId || this.getPixelId;

    this.driver.init();
  }

  public get Width(): number {
    console.debug('Matrix get Width');
    return this.width;
  }
  public get Height(): number {
    console.debug('Matrix get Height');
    return this.height;
  }

  public setPixel(x: number, y: number, color: Color) {
    console.debug('Matrix setPixel', x, y, color);
    this.driver.setPixel(this.getPixelId(x, y), color);
  }

  public getPixel(x: number, y: number): Color {
    console.debug('Matrix getPixel', x, y);
    return this.driver.getPixel(this.getPixelId(x, y));
  }

  public render(): void {
    console.debug('Matrix render');
    this.driver.flush();
    this.driver.render();
  }

  public reset(): void {
    console.debug('Matrix reset');
    this.driver.reset();
  }

  public clear(color: Color, blendAmount: number = 100): void {
    console.debug('Matrix clear', color);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const currentColor = this.getPixel(x, y);
        this.setPixel(x, y, currentColor.blend(color, blendAmount));
      }
    }
    this.render();
  } 
}