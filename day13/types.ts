export type Signal = (number | Signal)[];

export enum Result {
  InOrder = "in",
  NotInOrder = "not",
  Unknown = "unknown",
}

export type Pair = [Signal, Signal];

export type CompareCallback<T> = (a: T, b: T) => Result;
