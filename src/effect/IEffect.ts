import { IMatrixOptions, Matrix } from "../engine/matrix";
import { IDriver, IDriverOptions } from "../engine/matrix/driver";

export interface IEffectOptions {
  matrix: Matrix<IDriver<IDriverOptions>, IDriverOptions>
}

export abstract class IEffect<TEffectOptions extends IEffectOptions> {
  protected matrix: Matrix<IDriver<IDriverOptions>, IDriverOptions>;

  protected constructor(options: TEffectOptions) {
    console.debug('Effect constructor')
    this.matrix = options.matrix

    this.init && this.init()
  }

  public abstract init(): void
  public abstract update(): void
  public abstract render(): void
  public abstract reset(): void
}