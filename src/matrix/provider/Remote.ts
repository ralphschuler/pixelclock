import { IProvider, IProviderOptions } from "./IProvider";
import ws281x from "rpi-ws281x-native";

export interface RemoteOptions extends IProviderOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

export class Remote extends IProvider {

  constructor(options: RemoteOptions) {
    const { width, height, ledCount, host, port, username, password } = options;
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
    // TODO: Implement remote provider flush
  }
  
  protected onRender(): void {
    // TODO: Implement remote provider render
  }
  
  protected onDispose(): void {
    // TODO: Implement remote provider dispose
  }
  
  protected onReset(): void {
    // TODO: Implement remote provider reset
  }

}