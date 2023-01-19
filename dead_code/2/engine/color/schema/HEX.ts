import { Converter } from "../Converter";
import { Base } from "./Base";
import { INT } from "./INT";

export class HEX extends Base {

  public get Color(): string {
    return Converter.toHex(this.Value);
  }

  public set Color(value: string) {
    this.Value = Converter.fromHex(value);
  }

  public static fromRgb(r: number, g: number, b: number): HEX {
    return new HEX(Converter.fromRgb(r, g, b));
  }

  public static fromHsv(h: number, s: number, v: number): HEX {
    return new HEX(Converter.fromHsv(h, s, v));
  }

  public static fromHsl(h: number, s: number, l: number): HEX {
    return new HEX(Converter.fromHsl(h, s, l));
  }

  public static fromInt(color: number): HEX {
    return new HEX(color);
  }
}