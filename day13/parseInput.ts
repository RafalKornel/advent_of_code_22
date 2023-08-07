import { Signal } from "./types.ts";

export function parseInput(input: string[]): Signal[] {
  const signals: Signal[] = [];

  const filteredInput = input.filter((i) => i !== "");

  for (let i = 0; i < filteredInput.length; i++) {
    const value = JSON.parse(filteredInput[i]);

    signals.push(value);
  }

  return signals;
}
