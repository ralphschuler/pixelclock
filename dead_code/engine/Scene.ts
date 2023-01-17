import { Animated } from "./Animated";
import { Layer } from "./Layer";
import { Pixel } from "./Pixel";

export class Scene extends Animated {
  private layers: Layer[] = [];

  constructor() {
    super();
  }

  public addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  protected onUpdate(deltaTime: number) {
    this.layers.forEach(layer => layer.update(deltaTime));
  }

  protected onRender(deltaTime: number): Pixel[] {
    let result: Pixel[] = [];
    this.layers.forEach(layer => {
      const pixels = layer.render(deltaTime);
      pixels.forEach(pixel => {
        const index = result.findIndex(p => p.getX() === pixel.getX() && p.getY() === pixel.getY());
        if (index === -1) {
          result.push(new Pixel(pixel.getX(), pixel.getY(), pixel.getColor()));
        } else {
          result[index].setColor(pixel.getColor());
        }
      })
    });

    return result;
  }
}