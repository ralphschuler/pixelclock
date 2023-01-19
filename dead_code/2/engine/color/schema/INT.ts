import { Converter } from "../Converter";
import { Base } from "./Base";

export class INT extends Base {

  public get Color(): number {
    return this.Value;
  }
  public set Color(value: number) {
    this.Value = value;
  }

  public static fromRgb(r: number, g: number, b: number): INT {
    return new INT(Converter.fromRgb(r, g, b));
  }

  public static fromHsl(h: number, s: number, l: number): INT {
    return new INT(Converter.fromHsl(h, s, l));
  }

  public static fromHex(hex: string): INT {
    return new INT(Converter.fromHex(hex));
  }

  public static fromHsv(int: number): INT {
    return new INT(int);
  }

  public blend(target: Base, amount: number): Base {
    const parentColor = Converter.toRgb(this.Value);
    const targetColor = Converter.toRgb(target.Value);

    const r = parentColor.r + (targetColor.r - parentColor.r) * amount;
    const g = parentColor.g + (targetColor.g - parentColor.g) * amount;
    const b = parentColor.b + (targetColor.b - parentColor.b) * amount;

    return new Base(Converter.fromRgb(r, g, b));
  }

  public subtract(target: Base): Base {
    const parentColor = Converter.toRgb(this.Value);
    const targetColor = Converter.toRgb(target.Value);

    const r = parentColor.r - targetColor.r;
    const g = parentColor.g - targetColor.g;
    const b = parentColor.b - targetColor.b;

    return new Base(Converter.fromRgb(r, g, b));
  }

  public add(target: Base): Base {
    const parentColor = Converter.toRgb(this.Value);
    const targetColor = Converter.toRgb(target.Value);

    const r = parentColor.r + targetColor.r;
    const g = parentColor.g + targetColor.g;
    const b = parentColor.b + targetColor.b;

    return new Base(Converter.fromRgb(r, g, b));
  }
}