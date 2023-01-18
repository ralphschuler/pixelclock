export class Converter {
  public static fromHex(color: string): number {
    const bigint = parseInt(color.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return Converter.fromRgb(r, g, b);
  }

  public static toHex(color: number): string {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  public static fromHsl(hue: number, saturation: number, lightness: number): number {
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
    return Converter.fromRgb(r * 255, g * 255, b * 255);
  }

  public static toHsl(color: number): { hue: number, saturation: number, lightness: number } {
    let { r, g, b } = Converter.toRgb(color);
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

  public static fromRgb(r: number, g: number, b: number): number {
    return (r << 16) + (g << 8) + b;
  }

  public static toRgb(color: number): { r: number, g: number, b: number } {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    return { r, g, b };
  }

  public static fromHsv(hue: number, saturation: number, value: number): number {
    let r: number, g: number, b: number;
    let i: number, f: number, p: number, q: number, t: number;
    if (saturation == 0) {
      r = g = b = value;
    } else {
      hue /= 60;
      i = Math.floor(hue);
      f = hue - i;
      p = value * (1 - saturation);
      q = value * (1 - saturation * f);
      t = value * (1 - saturation * (1 - f));
      switch (i) {
        case 0:
          r = value;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = value;
          b = p;
          break;
        case 2:
          r = p;
          g = value;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = value;
          break;
        case 4:
          r = t;
          g = p;
          b = value;
          break;
        default:
          r = value;
          g = p;
          b = q;
      }
    }
    return Converter.fromRgb(r * 255, g * 255, b * 255);
  }

  public static toHsv(color: number): { hue: number, saturation: number, value: number } {
    let { r, g, b } = Converter.toRgb(color);
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let hue: number = 0, saturation: number = 0, value = max;

    const d = max - min;
    saturation = max == 0 ? 0 : d / max;

    if (max == min) {
      hue = 0; // achromatic
    } else {
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

    return { hue, saturation, value };
  }

  public static fromInt(color: number): number {
    return color;
  }

  public static toInt(color: number): number {
    return color;
  }
}