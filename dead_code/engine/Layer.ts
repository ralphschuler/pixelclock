import { Animated } from "./Animated";
import { Matrix } from "../Matrix";
import { Sprite } from "./Sprite";
import { Pixel } from "./Pixel";

export class Layer extends Animated {
  private sprites: Sprite[] = [];

  constructor() {
    super();
  }

  public addSprite(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  protected onUpdate(deltaTime: number){
    this.sprites.forEach(sprite => {
      sprite.update(deltaTime)
    });
  }

  protected onRender(deltaTime: number): Pixel[] {
    let result: Pixel[] = [];
    this.sprites.forEach(sprite => {
      const pixels = sprite.render(deltaTime);
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