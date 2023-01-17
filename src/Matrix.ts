import * as ws281x from 'rpi-ws281x-native';

export interface MatrixOptions {
  rows: number;
  columns: number;
  ledCount: number;
  getPixelId: (x: number, y: number) => number;
}

export class Matrix {

  private readonly rows: number;
  public get Rows() {
    return this.rows;
  }

  private readonly columns: number;
  public get Columns() {
    return this.columns;
  }

  private readonly getPixelId: (x: number, y: number) => number;

  private channel: any;

  constructor(options: MatrixOptions) {
    this.rows = options.rows;
    this.columns = options.columns;
    this.getPixelId = options.getPixelId;

    const count = this.rows * this.columns;
    this.channel = ws281x.init({
      dma: 10,
      freq: 800000,
      channels: [
        {
          count,
          gpio: 18,
          invert: false,
          brightness: 255,
          stripType: ws281x.stripType.WS2812,
        },
      ],
    });
  }

  public setPixel(x: number, y: number, color: number) {
    const index = this.getPixelId(x, y);
    this.channel.array[index] = color;
  }

  public getPixel(x: number, y: number): number {
    const index = this.getPixelId(x, y);
    return this.channel.array[index];
  }

  public render() {
    this.channel.render();
  }

  public clear() {
    this.channel.reset();
  }
}