import { Matrix } from "../Matrix";
import { Layer } from "./Layer";
import { Pixel } from "./Pixel";
import { Scene } from "./Scene";

export class Engine {
  
  private isRunning: boolean = false;
  private lastRenderTime: number = 0;

  private readonly matrix: Matrix;
  private scene: Scene;
  public setScene(scene: Scene) {
    this.scene = scene;
  }

  constructor(scene: Scene) {
    const rows = 5;
    const columns = 17;
    this.matrix = new Matrix({
      rows: rows,
      columns: columns,
      ledCount: 90,
      getPixelId: (x, y) => {
        if (x % 2 === 0) {
          return x / 2 + y * (rows + 1)
        } else {
          return rows + 1 - x + x / 2 + y * (rows + 1)
        }
      },
    });
    this.scene = scene;
  }

  public start() {
    this.isRunning = true;
    this.render();
  }

  public stop() {
    this.isRunning = false;
  }

  private render() {
    if (!this.isRunning) {
      return;
    }

    const now = Date.now();
    const deltaTime = now - this.lastRenderTime;

    this.scene.update(deltaTime);

    let result: Pixel[] = [];
    const pixels = this.scene.render(deltaTime);
    pixels.forEach(pixel => {
      const index = result.findIndex(p => p.getX() === pixel.getX() && p.getX() === pixel.getY());
      if (index === -1) {
        result.push(pixel);
      } else {
        result[index].setColor(pixel.getColor());
      }
    });

    for (let pixel of result) {
      this.matrix.setPixel(pixel.getX(), pixel.getY(), pixel.getColor());
    }

    this.matrix.render();

    this.lastRenderTime = now;

    setTimeout(() => this.render(), deltaTime < 1000 / 60 ? 1000 / 60 - deltaTime : 0);
  }
}