import ledDriver, { stripType } from 'rpi-ws281x-native';
import { IDriver, IDriverOptions } from './IDriver';

export interface IWS281xOptions extends IDriverOptions {
  stripType: keyof typeof stripType;
  invert: boolean;
  dma: number;
  brightness: number;
  gpio: number;
  frequency: number;
}

export class WS281x extends IDriver {

  private channel: any;
  private stripType: keyof typeof stripType;
  private inverted: boolean;
  private dma: number;
  private brightness: number;
  private gpio: number;
  private frequency: number;

  constructor(options: IWS281xOptions) {
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
    console.debug('WS281x set Brightness', brightness);
    this.brightness = brightness;
  }

  public get Brightness(): number {
    console.debug('WS281x get Brightness');
    return this.brightness;
  }

  init() {
    console.debug('WS281x init');
    this.channel = ledDriver.init({
      dma: this.dma,
      freq: this.frequency,
      channels: [
        {
          gpio: this.gpio,
          invert: this.inverted,
          count: this.ledCount,
          stripType: stripType[this.stripType],
          brightness: this.brightness
        }
      ]
    });
  }

  flush() {
    console.debug('WS281x flush');
    this.channel.buffer = this.pixelData;
    this.pixelData = Buffer.alloc(this.ledCount);
  }

  render() {
    console.debug('WS281x render');
    ledDriver.render();
  }

  reset() {
    console.debug('WS281x reset');
    ledDriver.reset();
  }
}