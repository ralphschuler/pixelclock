import { Color } from "../engine/matrix";
import { IEffectOptions, IEffect } from "./IEffect";

const DEFAULT_COLORS = [
  Color.fromRgb(255, 0, 0),
  Color.fromRgb(255, 90, 0),
  Color.fromRgb(255, 154, 0),
  Color.fromRgb(255, 206, 0),
  Color.fromRgb(255, 232, 8)
]

export interface IFireEffectOptions extends IEffectOptions {
  speed: number;
  intensity: number;
  direction: "up" | "down" | "left" | "right";
  colors?: Color[];
}

export class FireEffect extends IEffect<IFireEffectOptions> {
  private speed: number;
  private intensity: number;
  private direction: "up" | "down" | "left" | "right";
  private colors: Color[] = DEFAULT_COLORS;

  private pixels: {
    x: number;
    y: number;
    color: Color;
  }[] = [];

  constructor(options: IFireEffectOptions) {
    console.debug("Fire constructor");
    super(options);
    this.speed = options.speed;
    this.intensity = options.intensity;
    this.direction = options.direction;
    this.colors = options.colors || this.colors;
  }

  public init(): void {
    console.debug("Fire init");
    for (let i = 0; i < 3; i++) {
      this.spawnPixel();
    }
  }

  public update(): void {
    console.debug("Fire update");
    this.pixels.forEach((pixel, index) => {
      this.pixels[index].color = this.pixels[index].color.darken(0.1);
      switch (this.direction) {
        case "up":
          pixel.y--;
          break;
        case "down":
          pixel.y++;
          break;
        case "left":
          pixel.x--;
          break;
        case "right":
          pixel.x++;
          break;
      }

      if (pixel.x < 0 || pixel.x >= this.matrix.Width || pixel.y < 0 || pixel.y >= this.matrix.Height) {
        this.pixels.splice(index, 1);
        this.spawnPixel();
      }
    });
  }

  public render(): void {
    console.debug("Fire render");
    this.pixels.forEach(pixel => {
      this.matrix.setPixel(pixel.x, pixel.y, pixel.color);
    });
  }

  private spawnPixel(): void {
    console.debug("Fire spawnPixel");
    let x = Math.floor(Math.random() * this.matrix.Width);
    let y = 0

    switch (this.direction) {
      case "up":
        y = this.matrix.Height - 1
        break
      case "down":
        y = 0
        break
      case "left":
        x = this.matrix.Width - 1
        break
      case "right":
        x = 0
        break
    }

    let color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.pixels.push({ x, y, color });
  }

  public reset(): void {
    console.debug("Fire reset");
    this.pixels = [];
  }
}
