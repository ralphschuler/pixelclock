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
    this.driver.init();
    this.getPixelId = options.getPixelId || this.getPixelId;
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
    this.driver.render();
  }

  public reset(): void {
    console.debug('Matrix reset');
    this.driver.reset();
  }

  public clear(color: Color): void {
    console.debug('Matrix clear', color);
    this.driver.PixelData.fill(color.valueOf());
    this.render();
  } 
}