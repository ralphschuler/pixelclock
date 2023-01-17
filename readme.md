

## Structure
- Core
  - Pixel
    x: number
    y: number
    color: number
    onUpdate: (deltaTime: number) => void
    onRender: (deltaTime: number) => void
  - Sprite
    x: number
    y: number
    pixels: Pixel[]
    onUpdate: (deltaTime: number) => void
    onRender: (deltaTime: number) => void
  - Layer
    sprites: Sprite[]
    onUpdate: (deltaTime: number) => void
    onRender: (deltaTime: number) => void

  - Renderer
    matrix: Matrix
    layers: Layer[]
    start: () => void
    stop: () => void

  - Matrix