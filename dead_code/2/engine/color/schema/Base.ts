import { SchemaTypes } from ".";
import { Schema } from "..";
import { Converter } from "../Converter";
import { RGB } from "./RGB";

export class Base {
  private value: number;
  public get Value(): number {
    return this.value;
  }
  protected set Value(value: number) {
    this.value = value;
  }
  constructor(value: number) {
    this.value = value;
  }
}