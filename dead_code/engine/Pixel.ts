import { Matrix } from "../Matrix";
import { Animated } from "./Animated";

export class Pixel extends Animated {
  private x: number;
  private y: number;
  private color: number;

  constructor(x: number, y: number, color: number) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public getColor(): number {
    return this.color;
  }

  public setColor(color: number) {
    this.color = color;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setX(x: number) {
    this.x = x;
  }

  public setY(y: number) {
    this.y = y;
  }

  protected onUpdate(deltaTime: number) {
    
  }

  protected onRender(deltaTime: number): Pixel[] {
    return [this];
  }
}