import { HEX } from "./HEX";
import { INT } from "./INT";
import { RGB } from "./RGB";
import { HSL } from "./HSL";
import { HSV } from "./HSV";
import { Base } from "./Base";

export const Schemas = {
  HEX: HEX,
  INT: INT,
  RGB: RGB,
  HSL: HSL,
  HSV: HSV,
  Base: Base,
};

export type SchemaKeys = keyof typeof Schemas;
export type SchemaTypes = typeof Schemas[SchemaKeys];