import { readTextFile } from "../utils.ts";
import { parseData } from "./parseData.ts";
import { Stacks, Crate, Instruction } from "./types.ts";

function CrateMover9000(stacks: Stacks, instructions: Instruction[]): void {
  for (const instruction of instructions) {
    const { count, from, to } = instruction;

    const fromStack = stacks.get(from)!;
    const toStack = stacks.get(to)!;

    for (let c = count; c > 0; c--) {
      const crate = fromStack.pop();

      if (!crate) {
        throw new Error(`Could not pop a crate from ${from}`);
      }

      toStack.push(crate);
    }
  }
}

function CrateMover9001(stacks: Stacks, instructions: Instruction[]): void {
  for (const instruction of instructions) {
    const { count, from, to } = instruction;

    const fromStack = stacks.get(from)!;
    const toStack = stacks.get(to)!;

    const craneArm: Crate[] = [];

    for (let c = 0; c < count; c++) {
      const crate = fromStack.pop();

      if (!crate) {
        throw new Error(`Could not pop a crate from ${from}`);
      }

      craneArm.push(crate);
    }

    while (craneArm.length) {
      toStack.push(craneArm.pop()!);
    }
  }
}

type PerformInstructionsStrategy = (
  stacks: Stacks,
  instructions: Instruction[]
) => void;

function calculateTopCrates(
  input: string[],
  performInstructionsStrategy: PerformInstructionsStrategy
): string {
  const { stacks, instructions } = parseData(input);

  performInstructionsStrategy(stacks, instructions);

  const crates: Crate[] = [];

  for (const [_, stack] of stacks) {
    const topCrate = stack.pop();

    if (topCrate) {
      crates.push(topCrate);
    }
  }

  const word = crates.reduce((prev, next) => prev + next, "");

  return word;
}

const input = readTextFile("./input.txt");

const first = (lines: string[]) => calculateTopCrates(lines, CrateMover9000);

const second = (lines: string[]) => calculateTopCrates(lines, CrateMover9001);

console.log(second(input));
