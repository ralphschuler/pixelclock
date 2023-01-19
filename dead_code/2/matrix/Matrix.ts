import ws281x from 'rpi-ws281x-native';
import { Providers, ProviderKeys } from './provider';
import { IProvider, IProviderOptions } from './provider/IProvider';

export class Matrix<TProviderKeys extends ProviderKeys, TProviderOptions extends IProviderOptions> {
  constructor(provider: TProviderKeys, options: TProviderOptions) {
  }
}