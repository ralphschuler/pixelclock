import { IProvider, IProviderOptions } from "./IProvider";
import ws281x from "rpi-ws281x-native";

export interface WS281XOptions extends IProviderOptions {
  fps: number;
  gpio: number;
  invert: boolean;
  brightness: number;
  stripType: keyof typeof ws281x.stripType;
}

export class WS281X extends IProvider {

  private channel: any;

  private fps: number;
  public get FPS() {
    return this.fps;
  }
  public set FPS(value: number) {
    this.fps = value;
  }


  constructor(options: WS281XOptions) {
    const { width, height, ledCount, fps, gpio, invert, brightness, stripType } = options;
    super({ width, height, ledCount });

    this.fps = fps;
    this.channel = ws281x(this.LedCount, {
      gpio,
      invert,
      brightness,
      stripType: ws281x.stripType[stripType],
    });
  }

  protected getPixelIdByPos(x: number, y: number) {
    let id = 0
    if (x % 2 === 0) {
      id = x / 2 + y * (this.Width + 1);
    } else {
      id = this.Width + 1 - x + x / 2 + y * (this.Width + 1);
    }

    return Math.floor(id);
  }

  protected getPixelPosById(id: number) {
    const x = Math.floor(id / (this.Height + 1)) * 2;
    const y = id % (this.Height + 1);

    return { x, y };
  }

  protected onFlush(): void {
    this.channel.array = this.buffer;
  }
  
  protected onRender(): void {
    ws281x.render();
  }
  
  protected onDispose(): void {
    // TODO: Implement screen off

    ws281x.reset();
    ws281x.finalize();
  }
  
  protected onReset(): void {
    ws281x.reset();
  }

}