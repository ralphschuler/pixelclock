import { Schema } from ".";
import { Converter } from "./Converter";
import { SchemaTypes, SchemaKeys, Schemas } from "./schema";
import { HEX } from "./schema/HEX";
import { HSL } from "./schema/HSL";
import { HSV } from "./schema/HSV";
import { INT } from "./schema/INT";
import { RGB } from "./schema/RGB";
import { Base as SchemaBase } from "./schema/Base";

export class Color<SchemaBase> {
  private schema: SchemaBase;

  constructor(schemaType: SchemaBase) {
    this.schema =  schemaType
  }

  public static fromRgb(r: number, g: number, b: number): Color<INT> {
    return new Color<INT>(
      new INT(Converter.fromRgb(r, g, b))
    );
  }

  public static fromHsv(h: number, s: number, v: number): Color<INT> {
    return new Color<INT>(
      new INT(Converter.fromHsv(h, s, v))
    );
  }

  public static fromHsl(h: number, s: number, l: number): Color<INT> {
    return new Color<INT>(
      new INT(Converter.fromHsl(h, s, l))
    );
  }

  public static fromHex(hex: string): Color<INT> {
    return new Color<INT>(
      new INT(Converter.fromHex(hex))
    );
  }

}