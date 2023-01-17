import { Animated } from "./Animated";
import { Pixel } from "./Pixel";
import * as fs from "fs";
import { Matrix } from "../Matrix";

export class Sprite extends Animated {

  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private readonly asset: string;

  private pixels: Pixel[] = [];

  constructor(asset: string) {
    super();

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.asset = asset;

    this.loadAsset();
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public setX(x: number) {
    this.x = x;
  }

  public setY(y: number) {
    this.y = y;
  }

  private loadAsset() {
    const data = fs.readFileSync(this.asset, "utf8");
    const rows = JSON.parse(data);

    this.width = rows[0].length;
    this.height = rows.length;

    rows.forEach((row: number[], y: number) => {
      row.forEach((color: number, x: number) => {
        if (color !== 0) {
          this.pixels.push(new Pixel(x, y, color));
        }
      });
    });
  }

  public addPixel(pixel: Pixel) {
    this.pixels.push(pixel);
  }

  protected onUpdate(deltaTime: number) {
    this.pixels.forEach(pixel => {
      pixel.update(deltaTime);
    });
  }

  protected onRender(deltaTime: number): Pixel[] {
    let result: Pixel[] = [];
    this.pixels.forEach(pixel => {
      const newX = this.x + pixel.getX();
      const newY = this.y + pixel.getY();
      const index = result.findIndex(p => p.getX() === newX && p.getY() === newX);
      if (index === -1) {
        result.push(new Pixel(newX, newY, pixel.getColor()));
      } else {
        result[index].setColor(pixel.getColor());
      }
    });

    return result;
  }
}