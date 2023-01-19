import { SchemaTypes } from "../color/schema";
import { Layer } from "./Layer";
import { Pixel } from "./Pixel";
import { Scene } from "./Scene";

export class Base {
  private x: number;
  private y: number;

  private parent?: Base;
  public get Parent(): Base {
    return this.parent || this;
  }

  private children: Array<Base>;
  private renderRequests: Array<Base>;

  constructor(parent: undefined | Base | Pixel<SchemaTypes> | Layer | Scene, x: number, y: number) {
    this.parent = parent;
    this.children = [];
    this.renderRequests = [];

    this.x = x;
    this.y = y;
  }

  public get Children(): Array<Base> {
    return this.children;
  }
  public set Children(value: Array<Base>) {
    this.children = value;
  }

  public get X(): number {
    return this.x;
  }
  public set X(value: number) {
    this.x = value;
  }

  public get Y(): number {
    return this.y;
  }
  public set Y(value: number) {
    this.y = value;
  }

  protected onUpdate(): boolean {
    return false;
  }
  public update(): boolean {
    const requests = this.children.filter((child: Base) => child.update());
    if (requests.length > 0) {
      this.renderRequests.push(...requests);
    }

    return this.onUpdate() || this.renderRequests.length > 0;
  }

  protected onRender(): void {
    return;
  }
  public render(): void {
    this.renderRequests.forEach((child: Base) => {
      child.render();
      this.renderRequests.splice(this.renderRequests.indexOf(child), 1);
    });
    this.onRender();
  }

  protected onDispose(): void {
    return;
  }
  public dispose(): void {
    this.children.forEach((child: Base) => {
      child.dispose();
      this.children.splice(this.children.indexOf(child), 1);
    });
    this.onDispose();
  }
}