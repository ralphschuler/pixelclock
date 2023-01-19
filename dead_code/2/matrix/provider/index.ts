import { WS281X, WS281XOptions } from "./WS281X";
import { Remote, RemoteOptions } from "./Remote";
import { VideoStream, VideoStreamOptions } from "./VideoStream";

export const Providers = {
  WS281X,
  Remote,
  VideoStream,
};

export type ProviderOptions = WS281XOptions | RemoteOptions | VideoStreamOptions;

export type ProviderKeys = keyof typeof Providers;
export type ProviderTypes = typeof Providers[ProviderKeys];

export type ProviderOptionsKeys = keyof ProviderOptions;
export type ProviderOptionsTypes = ProviderOptions[ProviderOptionsKeys];
