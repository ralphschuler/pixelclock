import { Pixel } from "../engine/Pixel";
import { Scene } from "../engine/Scene";

export class Clock extends Scene {
  constructor() {
    super();
  }

  protected onUpdate(deltaTime: number) {
    const hour = String(new Date().getHours()).padStart(2, "0");
    const minute = String(new Date().getMinutes()).padStart(2, "0");

    const time = `${hour}:${minute}`;
  }

  protected onRender(deltaTime: number): Pixel[] {
    
  }

}