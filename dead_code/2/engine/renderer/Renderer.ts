import { Scene } from "./Scene";

export class Renderer {

  private interval?: NodeJS.Timer;

  private isRunnung: boolean;
  public get IsRunnung(): boolean {
    return this.isRunnung;
  }

  private scene: Scene;
  public get Scene(): Scene {
    return this.scene;
  }
  public set Scene(value: Scene) {
    this.scene = value;
  }

  constructor(scene: Scene) {
    this.isRunnung = false;
    this.scene = scene;
  }

  private start(): void {
    this.isRunnung = true;

    this.interval = setInterval(this.loop.bind(this), 1000 / 60);
  }

  private stop(): void {
    this.isRunnung = false;

    clearInterval(this.interval);
  }

  private loop(): void {
    if (this.scene.update()) {
      this.render();
    }
  }

  private render(): void {
    this.scene.render();
  }

}