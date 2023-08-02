import { Stacks, StackId, Stack, Crate, Instruction } from "./types.ts";

function parseStacksInput(input: string[]): Stacks {
  const lastLineIndex = input.length - 1;

  const lastLine = input.at(lastLineIndex);

  if(!lastLine) throw new Error(`Wrong input: ${input}`);

  const idIndices = new Map<StackId, number>();

  const stacks = new Map<StackId, Stack>();

  for(let i = 0;i < lastLine.length;i++) {
    const char = lastLine[i];

    if(char === " ") continue;

    idIndices.set(char, i);
    stacks.set(char, []);
  }

  for(let l = lastLineIndex - 1;l >= 0;l--) {
    const line = input[l];

    for(const [id, index] of idIndices) {
      const value = line[index];

      // we've stumbled across character that is not a crate
      if(["[", "]", " ", ""].includes(value)) continue;

      const stack = stacks.get(id);

      if(!stack) throw new Error(`Could not find stack: ${id}`);

      stack.push(value as Crate);
    }
  }

  return stacks;
}
function parseInstructionsInput(input: string[]): Instruction[] {
  const instructions: Instruction[] = [];

  for(const line of input) {
    const words = line.split(" "); // ["move", number, "from", number, "to", number]

    const count = Number.parseInt(words[1]);

    if(!Number.isSafeInteger(count))
      throw new Error(`Wrong instruction format: ${line}`);

    const from = words[3];
    const to = words[5];

    const instruction: Instruction = {
      count,
      from,
      to,
    };

    instructions.push(instruction);
  }

  return instructions;
}
export function parseData(lines: string[]) {
  const dividerIndex = lines.findIndex((v) => v === "");

  const stacksInput = lines.slice(0, dividerIndex);
  const instructionsInput = lines.slice(dividerIndex + 1);

  const stacks = parseStacksInput(stacksInput);
  const instructions = parseInstructionsInput(instructionsInput);

  return { stacks, instructions };
}
