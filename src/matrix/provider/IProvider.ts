export interface IProviderOptions {
  width: number, height: number, ledCount?: number
}

export abstract class IProvider {
  private readonly width: number;
  private readonly height: number;
  private readonly ledCount: number;

  protected buffer: number[] = [];
  constructor(options: IProviderOptions) {
    this.width = options.width;
    this.height = options.height;
    this.ledCount = options.ledCount || options.width * options.height;

    this.reset();
  }

  protected getPixelIdByPos (x: number, y: number) {
    return x + y * this.width;
  }

  protected getPixelPosById (id: number) {
    return {
      x: id % this.width,
      y: Math.floor(id / this.width),
    };
  }

  public get Width() {
    return this.width;
  }

  public get Height() {
    return this.height;
  }

  public get LedCount() {
    return this.ledCount;
  }

  public getPixel(x: number, y: number): number {
    return this.buffer[this.getPixelIdByPos(x, y)];
  }

  public setPixel(x: number, y: number, color: number) {
    this.buffer[this.getPixelIdByPos(x, y)] = color;
  }

  protected abstract onFlush(): void;
  protected flush() {
    this.onFlush && this.onFlush();
    this.reset();
  }

  protected abstract onRender(): void;
  public render() {
    this.flush();
    this.onRender && this.onRender();
  }

  protected abstract onReset(): void;
  public reset() {
    this.buffer = new Array(this.ledCount).fill(0x000000);
    this.onReset && this.onReset();
  }

  protected abstract onDispose(): void;
  public dispose() {
    this.reset();
    this.render();

    this.onDispose && this.onDispose();
  }
}