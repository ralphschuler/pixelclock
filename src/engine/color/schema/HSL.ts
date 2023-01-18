import { Converter } from "../Converter";
import { Base } from "./Base";

export class HSL extends Base {

  public get Color(): { h: number, s: number, l: number } {
    return Converter.toHsl(this.Value);
  }
  public set Color(value: { h: number, s: number, l: number }) {
    this.Value = Converter.fromHsl(value.h, value.s, value.l);
  }

  public get H(): number {
    return Converter.toHsl(this.Value).hue;
  }
  public set H(value: number) {
    this.Value = Converter.fromHsl(value, this.S, this.L);
  }

  public get S(): number {
    return Converter.toHsl(this.Value).saturation;
  }
  public set S(value: number) {
    this.Value = Converter.fromHsl(this.H, value, this.L);
  }

  public get L(): number {
    return Converter.toHsl(this.Value).lightness;
  }
  public set L(value: number) {
    this.Value = Converter.fromHsl(this.H, this.S, value);
  }

  public static fromRgb(r: number, g: number, b: number): HSL {
    return new HSL(Converter.fromRgb(r, g, b));
  }

  public static fromHsv(h: number, s: number, v: number): HSL {
    return new HSL(Converter.fromHsv(h, s, v));
  }

  public static fromHex(hex: string): HSL {
    return new HSL(Converter.fromHex(hex));
  }

  public static fromInt(color: number): HSL {
    return new HSL(color);
  }
}