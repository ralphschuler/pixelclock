import { Converter } from "../Converter";
import { Base } from "./Base";

export class RGB extends Base {

  public static fromInt(r: number, g: number, b: number): RGB {
    return new RGB(Converter.fromRgb(r, g, b));
  }

  public static fromHsl(h: number, s: number, l: number): RGB {
    return new RGB(Converter.fromHsl(h, s, l));
  }

  public static fromHex(hex: string): RGB {
    return new RGB(Converter.fromHex(hex));
  }

  public static fromHsv(int: number): RGB {
    return new RGB(int);
  }

  public get R(): number {
    return Converter.toRgb(this.Value).r;
  }
  public set R(value: number) {
    this.Value = Converter.fromRgb(value, this.G, this.B);
  }

  public get G(): number {
    return Converter.toRgb(this.Value).g;
  }
  public set G(value: number) {
    this.Value = Converter.fromRgb(this.R, value, this.B);
  }

  public get B(): number {
    return Converter.toRgb(this.Value).b;
  }
  public set B(value: number) {
    this.Value = Converter.fromRgb(this.R, this.G, value);
  }
}