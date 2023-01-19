import { Color } from "../color";
import { SchemaTypes, SchemaKeys, Schemas } from "../color/schema";
import { INT } from "../color/schema/INT";
import { RGB } from "../color/schema/RGB";
import { Base } from "./Base";
import{ Base as SchemaBase } from "../color/schema/Base";
import { Layer } from "./Layer";

export class Pixel<SchemaBase> extends Base {
  private color: Color<SchemaBase> = new Color<SchemaBase>(INT.fromRgb(0, 0, 0));
  public get Color(): Color<SchemaBase> {
    return this.color;
  }
  protected set Color(color: Color<SchemaBase>) {
    this.color = color;
  }

  protected onUpdate(): boolean {
    return false;
  }

  protected onRender(): void {
    return;
  }

  protected onDispose(): void {
    return;
  }
}