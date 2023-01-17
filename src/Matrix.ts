import ws281x from 'rpi-ws281x-native';

export interface MatrixOptions {
  width: number;
  height: number;
  ledCount: number;
  getPixelId: (x: number, y: number) => number;
}

export class Matrix {

  private readonly ledCount: number;

  private readonly height: number;
  public get Height() {
    return this.height;
  }

  private readonly width: number;
  public get Width() {
    return this.width;
  }

  private readonly getPixelId: (x: number, y: number) => number;

  private channel: any;

  constructor(options: MatrixOptions) {
    this.height = options.height;
    this.width = options.width;
    this.getPixelId = options.getPixelId;
    this.ledCount = options.ledCount;
    this.channel = ws281x(this.ledCount, {
      gpio: 18,
      invert: false,
      brightness: 255,
      stripType: ws281x.stripType.WS2812,
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
    ws281x.render();
  }

  public clear() {
    ws281x.reset();
  }
}