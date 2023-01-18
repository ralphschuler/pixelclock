import { Converter } from "../Converter";
import { Base } from "./Base";
import { INT } from "./INT";

export class HSV extends Base {

  public get Color(): { h: number, s: number, v: number } {
    return Converter.toHsv(this.Value);
  }
  public set Color(value: { h: number, s: number, v: number }) {
    this.Value = Converter.fromHsv(value.h, value.s, value.v);
  }

  public get H(): number {
    return Converter.toHsv(this.Value).h;
  }
  public set H(value: number) {
    this.Value = Converter.fromHsv(value, this.S, this.V);  
  }

  public get S(): number {
    return Converter.toHsv(this.Value).s;
  }
  public set S(value: number) {
    this.Value = Converter.fromHsv(this.H, value, this.V);
  }

  public get V(): number {
    return Converter.toHsv(this.Value).v;
  }
  public set V(value: number) {
    this.Value = Converter.fromHsv(this.H, this.S, value);
  }

  public static fromRgb(r: number, g: number, b: number): HSV {
    return new HSV(Converter.fromRgb(r, g, b));
  }

  public static fromHsl(h: number, s: number, l: number): HSV {
    return new HSV(Converter.fromHsl(h, s, l));
  }

  public static fromHex(hex: string): HSV {
    return new HSV(Converter.fromHex(hex));
  }

  public static fromInt(int: number): HSV {
    return new HSV(int);
  }
}