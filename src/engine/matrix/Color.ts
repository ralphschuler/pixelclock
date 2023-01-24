export class Color extends Number implements Number {

  public static readonly Black: Color = new Color(0x000000)
  public static readonly White: Color = new Color(0xffffff)
  public static readonly Red: Color = new Color(0xff0000)
  public static readonly Green: Color = new Color(0x00ff00)
  public static readonly Blue: Color = new Color(0x0000ff)
  public static readonly Yellow: Color = new Color(0xffff00)
  public static readonly Cyan: Color = new Color(0x00ffff)
  public static readonly Magenta: Color = new Color(0xff00ff)

  constructor(color: number) {
    super(color)
  }

  public valueOf(): number {
    return super.valueOf()
  }

  public static add(firstColor: Color, secondColor: Color): Color {
    const r = Math.min(255, (firstColor.valueOf() >> 16) + (secondColor.valueOf() >> 16))
    const g = Math.min(255, ((firstColor.valueOf() >> 8) & 0xff) + ((secondColor.valueOf() >> 8) & 0xff))
    const b = Math.min(255, (firstColor.valueOf() & 0xff) + (secondColor.valueOf() & 0xff))

    return new Color((r << 16) + (g << 8) + b)
  }

  public subtract(color: Color): Color {
    return Color.subtract(this, color)
  }

  public static subtract(color: Color, color2: Color): Color {
    const r = Math.max(0, (color.valueOf() >> 16) - (color2.valueOf() >> 16))
    const g = Math.max(0, ((color.valueOf() >> 8) & 0xff) - ((color2.valueOf() >> 8) & 0xff))
    const b = Math.max(0, (color.valueOf() & 0xff) - (color2.valueOf() & 0xff))

    return new Color((r << 16) + (g << 8) + b)
  }

  public multiply(color: Color): Color {
    return Color.multiply(this, color)
  }
  public static multiply(firstColor: Color, secondColor: Color): Color {
    const r = Math.min(255, (firstColor.valueOf() >> 16) * (secondColor.valueOf() >> 16))
    const g = Math.min(255, ((firstColor.valueOf() >> 8) & 0xff) * ((secondColor.valueOf() >> 8) & 0xff))
    const b = Math.min(255, (firstColor.valueOf() & 0xff) * (secondColor.valueOf() & 0xff))

    return new Color((r << 16) + (g << 8) + b)
  }

  public blend(secondColor: Color, amount: number): Color {
    return Color.blend(this, secondColor, amount)
  }

  public static blend(firstColor: Color, secondColor: Color, amount: number): Color {
    const r = Math.min(255, (firstColor.valueOf() >> 16) * (1 - amount) + (secondColor.valueOf() >> 16) * amount)
    const g = Math.min(255, ((firstColor.valueOf() >> 8) & 0xff) * (1 - amount) + ((secondColor.valueOf() >> 8) & 0xff) * amount)
    const b = Math.min(255, (firstColor.valueOf() & 0xff) * (1 - amount) + (secondColor.valueOf() & 0xff) * amount)

    return new Color((r << 16) + (g << 8) + b)
  }

  public lighten(amount: number): Color {
    return Color.lighten(this, amount)
  }

  public static lighten(color: Color, amount: number): Color {
    return Color.blend(color, Color.White, amount)
  }

  public darken(amount: number): Color {
    return Color.darken(this, amount)
  }

  public static darken(color: Color, amount: number): Color {
    return Color.blend(color, Color.Black, amount)
  }

  public toRgb(): [number, number, number] {
    return Color.toRgb(this)
  }

  public static toRgb(color: Color): [number, number, number] {
    return [(color.valueOf() >> 16) & 0xff, (color.valueOf() >> 8) & 0xff, color.valueOf() & 0xff]
  }

  public toHex(): string {
    return Color.toHex(this)
  }

  public static toHex(color: Color): string {
    return color.toString(16)
  }

  public toHsl(): [number, number, number] {
    return Color.toHsl(this)
  }

  public static toHsl(color: Color): [number, number, number] {
    const r = ((color.valueOf() >> 16) & 0xff) / 255
    const g = ((color.valueOf() >> 8) & 0xff) / 255
    const b = (color.valueOf() & 0xff) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h: number = 0, s: number, l = (max + min) / 2

    if (max == min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [h, s, l]
  }

  public toHsv(): [number, number, number] {
    return Color.toHsv(this)
  }

  public static toHsv(color: Color): [number, number, number] {
    const r = ((color.valueOf() >> 16) & 0xff) / 255
    const g = ((color.valueOf() >> 8) & 0xff) / 255
    const b = (color.valueOf() & 0xff) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h: number = 0, s: number, v = max

    const d = max - min
    s = max == 0 ? 0 : d / max

    if (max == min) {
      h = 0 // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [h, s, v]
  }

  public toCmyk(): [number, number, number, number] {
    return Color.toCmyk(this)
  }
  public static toCmyk(color: Color): [number, number, number, number] {
    const r = ((color.valueOf() >> 16) & 0xff) / 255
    const g = ((color.valueOf() >> 8) & 0xff) / 255
    const b = (color.valueOf() & 0xff) / 255

    const k = 1 - Math.max(r, g, b)
    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)

    return [c, m, y, k]
  }

  public toCmy(): [number, number, number] {
    return Color.toCmy(this)
  }

  public static toCmy(color: Color): [number, number, number] {
    const r = ((color.valueOf() >> 16) & 0xff) / 255
    const g = ((color.valueOf() >> 8) & 0xff) / 255
    const b = (color.valueOf() & 0xff) / 255

    const c = 1 - r
    const m = 1 - g
    const y = 1 - b

    return [c, m, y]
  }

  public static fromRgb(r: number, g: number, b: number): Color {
    return new Color((r << 16) | (g << 8) | b)
  }

  public static fromHex(hex: string): Color {
    return new Color(parseInt(hex, 16))
  }

  public static fromHsl(h: number, s: number, l: number): Color {
    let r: number, g: number, b: number

    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return Color.fromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
  }

  public static fromHsv(h: number, s: number, v: number): Color {
    let r: number = 0, g: number = 0, b: number = 0

    let i = Math.floor(h * 6)
    let f = h * 6 - i
    let p = v * (1 - s)
    let q = v * (1 - f * s)
    let t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        ;(r = v), (g = t), (b = p)
        break
      case 1:
        ;(r = q), (g = v), (b = p)
        break
      case 2:
        ;(r = p), (g = v), (b = t)
        break
      case 3:
        ;(r = p), (g = q), (b = v)
        break
      case 4:
        ;(r = t), (g = p), (b = v)
        break
      case 5:
        ;(r = v), (g = p), (b = q)
        break
    }

    return Color.fromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
  }

  public static fromCmyk(c: number, m: number, y: number, k: number): Color {
    const r = 1 - Math.min(1, c * (1 - k) + k)
    const g = 1 - Math.min(1, m * (1 - k) + k)
    const b = 1 - Math.min(1, y * (1 - k) + k)

    return Color.fromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
  }

  public static fromCmy(c: number, m: number, y: number): Color {
    return Color.fromCmyk(c, m, y, 0)
  }

  public static fromRandom(): Color {
    return Color.fromHex(Math.floor(Math.random() * 16777215).toString(16))
  }
}