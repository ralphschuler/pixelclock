import { Color } from "./Color";
import { Driver, IDriverOptions } from "./driver/Driver";

export interface MatrixOptions<TDriver extends Driver, TDriverOptions extends IDriverOptions> {
  width: number;
  height: number;
  driver: new (options: TDriverOptions) => TDriver;
  driverOptions: TDriverOptions;
  getPixelId?: (x: number, y: number) => number;
}

export class Matrix<TDriver extends Driver, TDriverOptions extends IDriverOptions> {

  private readonly width: number;
  private readonly height: number;
  private readonly driver: TDriver;

  private getPixelId: (x: number, y: number) => number = (x, y) => {
    return y * this.width + x;
  }

  constructor(options: MatrixOptions<TDriver, TDriverOptions>) {
    this.width = options.width;
    this.height = options.height;
    this.driver = new options.driver(options.driverOptions);
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
    this.driver.render();
  }

  public reset(): void {
    this.driver.reset();
  }

  public clear(color: Color): void {
    this.driver.PixelData.fill(color.valueOf());
    this.render();
  } 
}