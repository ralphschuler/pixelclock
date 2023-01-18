import { Color, ColorType } from "./Color";

export class ColorConverter {
  public static fromHex(color: string): { r: number; g: number; b: number } {
    const bigint = parseInt(color.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  public static toHex(color: Color<keyof ColorType>): Color<keyof ColorType> {
    const r = color.getR();
    const g = color.getG();
    const b = color.getB();
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  public static fromHsl(hue: number, saturation: number, lightness: number): Color<ColorType> {
    let r: number, g: number, b: number;
    if (saturation == 0) {
      r = g = b = lightness; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      r = hue2rgb(p, q, hue + 1 / 3);
      g = hue2rgb(p, q, hue);
      b = hue2rgb(p, q, hue - 1 / 3);
    }
    return new Color(r, g, b);
  }

  public static toHsl(color: Color<keyof ColorType>): Color<keyof ColorType> {
    let r = color.getR();
    let g = color.getG();
    let b = color.getB();
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let hue: number = 0, saturation: number = 0, lightness = (max + min) / 2;

    if (max == min) {
      hue = saturation = 0; // achromatic
    } else {
      const d = max - min;
      saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          hue = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / d + 2;
          break;
        case b:
          hue = (r - g) / d + 4;
          break;
      }
      hue /= 6;
    }

    return { hue, saturation, lightness };
  }

  public static fromInteger(number: number): Color<keyof ColorType> {
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return new Color(r, g, b);
  }

  public static toInteger(color: Color<keyof ColorType>): number {
    const { r, g, b } = color.value;
    return (r << 16) | (g << 8) | b;
  }
}