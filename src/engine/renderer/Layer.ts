import { Base } from "./Base";
import { Pixel } from "./Pixel";
import { Scene } from "./Scene";

export class Layer extends Base {
  private width: number;
  private height: number;

  constructor(parent: Scene, x: number, y: number, width: number, height: number) {
    super(parent, x, y);
    this.width = width;
    this.height = height;
  }

  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }
}