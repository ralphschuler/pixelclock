import { Base } from "./Base";

export class Scene extends Base {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    super(this, 0, 0);
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