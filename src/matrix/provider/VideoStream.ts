import { IProvider, IProviderOptions } from "./IProvider";
import ws281x from "rpi-ws281x-native";

export interface VideoStreamOptions extends IProviderOptions {
  
}

export class VideoStream extends IProvider {

  constructor(options: VideoStreamOptions) {
    const { width, height, ledCount } = options;
    super({ width, height, ledCount });

    // TODO: Implement remote provider connection
  }

  protected getPixelIdByPos(x: number, y: number) {
    return x + y * this.Width;
  }

  protected getPixelPosById(id: number) {
    return {
      x: id % this.Width,
      y: Math.floor(id / this.Width),
    };
  }

  protected onFlush(): void {
    // TODO: Implement video stream provider flush
  }
  
  protected onRender(): void {
    // TODO: Implement  video stream provider render
  }
  
  protected onDispose(): void {
    // TODO: Implement  video stream provider dispose
  }
  
  protected onReset(): void {
    // TODO: Implement  video stream provider reset
  }

}