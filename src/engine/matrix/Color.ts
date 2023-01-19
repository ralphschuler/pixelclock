export class Color extends Number implements Number {

  constructor(color: number) {
    console.debug('Color constructor', color)
    super(color)
  }

  public valueOf(): number {
    console.debug('Color valueOf')
    return super.valueOf()
  }

  public add(this: Color, color: Color): Color {
    console.debug('Color add', this, color)
    const r = Math.min(255, (color.valueOf() >> 16) + (this.valueOf() >> 16))
    const g = Math.min(255, ((color.valueOf() >> 8) & 0xff) + ((this.valueOf() >> 8) & 0xff))
    const b = Math.min(255, (color.valueOf() & 0xff) + (this.valueOf() & 0xff))

    return new Color((r << 16) + (g << 8) + b)
  }

  public subtract(this: Color, color: Color): Color {
    console.debug('Color subtract', this, color)
    const r = Math.max(0, (color.valueOf() >> 16) - (this.valueOf() >> 16))
    const g = Math.max(0, ((color.valueOf() >> 8) & 0xff) - ((this.valueOf() >> 8) & 0xff))
    const b = Math.max(0, (color.valueOf() & 0xff) - (this.valueOf() & 0xff))

    return new Color((r << 16) + (g << 8) + b)
  }

  public blend(this: Color, color: Color, amount: number): Color {
    console.debug('Color blend', this, color, amount)
    const r = Math.round((color.valueOf() >> 16) * amount + (this.valueOf() >> 16) * (1 - amount))
    const g = Math.round(((color.valueOf() >> 8) & 0xff) * amount + ((this.valueOf() >> 8) & 0xff) * (1 - amount))
    const b = Math.round((color.valueOf() & 0xff) * amount + (this.valueOf() & 0xff) * (1 - amount))

    return new Color((r << 16) + (g << 8) + b)
  }

  public lighten(this: Color, amount: number): Color {
    console.debug('Color lighten', this, amount)
    let [h, s, l] = this.toHsl()
    l = Math.min(1, l + amount)

    return Color.fromHsl(h, s, l)
  }

  public darken(this: Color, amount: number): Color {
    console.debug('Color darken', this, amount)
    let [h, s, l] = this.toHsl()
    l = Math.max(0, l - amount)

    return Color.fromHsl(h, s, l)
  }

  public toRgb(this: Color): [number, number, number] {
    console.debug('Color toRgb', this)
    return [(this.valueOf() >> 16) & 0xff, (this.valueOf() >> 8) & 0xff, this.valueOf() & 0xff]
  }

  public toHex(this: Color): string {
    console.debug('Color toHex', this)
    return this.toString(16)
  }

  public toHsl(this: Color): [number, number, number] {
    console.debug('Color toHsl', this)
    const r = ((this.valueOf() >> 16) & 0xff) / 255
    const g = ((this.valueOf() >> 8) & 0xff) / 255
    const b = (this.valueOf() & 0xff) / 255

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

  public toHsv(this: Color): [number, number, number] {
    console.debug('Color toHsv', this)
    const r = ((this.valueOf() >> 16) & 0xff) / 255
    const g = ((this.valueOf() >> 8) & 0xff) / 255
    const b = (this.valueOf() & 0xff) / 255

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

  public toCmyk(this: Color): [number, number, number, number] {
    console.debug('Color toCmyk', this)
    const r = ((this.valueOf() >> 16) & 0xff) / 255
    const g = ((this.valueOf() >> 8) & 0xff) / 255
    const b = (this.valueOf() & 0xff) / 255

    const k = 1 - Math.max(r, g, b)
    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)

    return [c, m, y, k]
  }

  public toCmy(this: Color): [number, number, number] {
    console.debug('Color toCmy', this)
    const r = ((this.valueOf() >> 16) & 0xff) / 255
    const g = ((this.valueOf() >> 8) & 0xff) / 255
    const b = (this.valueOf() & 0xff) / 255

    const c = 1 - r
    const m = 1 - g
    const y = 1 - b

    return [c, m, y]
  }

  public static fromRgb(r: number, g: number, b: number): Color {
    console.debug('Color fromRgb', r, g, b)
    return new Color((r << 16) | (g << 8) | b)
  }

  public static fromHex(hex: string): Color {
    console.debug('Color fromHex', hex)
    return new Color(parseInt(hex, 16))
  }

  public static fromHsl(h: number, s: number, l: number): Color {
    console.debug('Color fromHsl', h, s, l)
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
    console.debug('Color fromHsv', h, s, v)
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
    console.debug('Color fromCmyk', c, m, y, k)
    const r = 1 - Math.min(1, c * (1 - k) + k)
    const g = 1 - Math.min(1, m * (1 - k) + k)
    const b = 1 - Math.min(1, y * (1 - k) + k)

    return Color.fromRgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
  }

  public static fromCmy(c: number, m: number, y: number): Color {
    console.debug('Color fromCmy', c, m, y)
    return Color.fromCmyk(c, m, y, 0)
  }

  public static fromRandom(): Color {
    console.debug('Color fromRandom')
    return Color.fromHex(Math.floor(Math.random() * 16777215).toString(16))
  }
}