import ledDriver, { stripType } from 'rpi-ws281x-native';
import { IDriver, IDriverOptions } from './IDriver';

export type StripType = keyof typeof stripType

export interface IWS281xOptions extends IDriverOptions {
  stripType: StripType;
  invert: boolean;
  dma: number;
  brightness: number;
  gpio: number;
  frequency: number;
}

export class WS281x<TDriverOptions extends IWS281xOptions> extends IDriver<TDriverOptions> {

  private channel: any;
  private stripType: StripType;
  private inverted: boolean;
  private dma: number;
  private brightness: number;
  private gpio: number;
  private frequency: number;

  constructor(options: TDriverOptions) {
    console.debug('WS281x constructor');
    super(options);
    this.stripType = options.stripType;
    this.inverted = options.invert;
    this.dma = options.dma;
    this.brightness = options.brightness;
    this.gpio = options.gpio;
    this.frequency = options.frequency;
  }

  public set Brightness(brightness: number) {
    this.brightness = this.channel.brightness = brightness;
  }

  public get Brightness(): number {
    return this.brightness;
  }

  public init() {
    this.channel = ledDriver(this.ledCount,{
      gpio: this.gpio,
      invert: this.inverted,
      stripType: stripType[this.stripType as keyof typeof stripType],
      brightness: this.brightness
    });
  }

  public flush() {
    this.pixelData.forEach((color, index) => {
      this.channel.array[index] = color;
    });
    this.pixelData = [];
  }

  public render() {
    ledDriver.render();
  }

  public reset() {
    ledDriver.reset();
  }
}