import { Matrix } from "../Matrix";
import { Pixel } from "./Pixel";

export class Animated {
  protected onUpdate(deltaTime: number) {
    throw new Error("Method not implemented.");
  }
  public update(deltaTime: number) {
    return this.onUpdate(deltaTime);
  }

  protected onRender(deltaTime: number): Pixel[] {
    throw new Error("Method not implemented.");
  }
  public render(deltaTime: number): Pixel[] {
    return this.onRender(deltaTime);
  }
}