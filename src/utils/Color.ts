import { ColorConverter } from "./ColorConverter";

export const ColorTypes = {
  RGB: "rgb",
  HSL: "hsl",
  HEX: "hex",
  INT: "int",
} as const;

type ColorTypesValues<ColorTypes> = ColorTypes[keyof ColorTypes];
export type ColorType = ColorTypesValues<typeof ColorTypes>

export class Color<TKey extends keyof ColorType> {
  private color: Color<TKey>;
  public get(): Color<TKey> {
    return this.encode
  }

  constructor(color: TKey) {
    this.color = color;
  }

  private encode<TKey extends keyof ColorType>(color: Color<TKey>): Color<TKey> {
    const type = 
    switch (type) {
      case ColorTypes.HEX:
        return ColorConverter.toHex(this);
      case ColorTypes.HSL:
        return ColorConverter.toHsl(this);
      case ColorTypes.RGB:
        return ColorConverter.toRgb(this);
      case ColorTypes.INT:
        return ColorConverter.toInt(this);
      default:
        throw new Error("Invalid color type");
    }
  }

  private decode<TKey extends keyof ColorType>(color: Color<TKey>): Color<TKey> {
    const type = 
    
    switch (type) {
      case ColorTypes.HEX:
        return ColorConverter.fromHex(this);
      case ColorTypes.HSL:
        return ColorConverter.fromHsl(this);
      case ColorTypes.RGB:
        return ColorConverter.fromRgb(this);
      case ColorTypes.INT:
        return ColorConverter.fromInt(this);
      default:
        throw new Error("Invalid color type");
    }
  }

}