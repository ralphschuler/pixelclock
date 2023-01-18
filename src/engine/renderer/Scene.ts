import { Base } from "./Base";

export class Scene extends Base {
  private width: number;
  private height: number;

  constructor(parent: , x: number, y: number, width: number, height: number) {
    
  }

  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }
}