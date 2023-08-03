import { parseInstruction } from "./index.ts";
import { ClockCallback, Instruction } from "./types.ts";

export function CPU() {
  let cycle = 0;
  let register = 1;

  let instruction: Instruction | undefined;

  const program: Instruction[] = [];

  function loadProgram(instructions: string[]) {
    for (let i = instructions.length - 1; i >= 0; i--) {
      program.push(parseInstruction(instructions[i]));
    }
  }

  function run(operation?: ClockCallback) {
    instruction = program.pop();

    while (instruction) {
      cycle++;
      instruction.cycles--;

      if (operation) {
        operation(cycle, register);
      }

      if (instruction.cycles > 0) {
        continue;
      }

      if (instruction.type === "addx") {
        register += instruction.value;
      }

      instruction = program.pop();
    }
  }

  return { loadProgram, run };
}
