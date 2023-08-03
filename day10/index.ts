import { readTextFile } from "../utils.ts";
import { CPU } from "./CPU.ts";
import { CRT } from "./CRT.ts";
import { Instruction, Add, Noop } from "./types.ts";

export function parseInstruction(input: string): Instruction {
  const [type, value] = input.split(" ");

  if (type === "addx") {
    return { type, cycles: 2, value: Number(value) } as Add;
  }

  if (type === "noop") {
    return { type, cycles: 1 } as Noop;
  }

  throw new Error(`Unsupported instruction! ${input}`);
}

function first(input: string[]) {
  const signalReadings: number[] = [];

  const cpu = CPU();

  cpu.loadProgram(input);

  cpu.run((cycle, register) => {
    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      signalReadings.push(cycle * register);
    }
  });

  return signalReadings.reduce((p, n) => p + n, 0);
}

// This seems kinda like mediator pattern 🤔
function second(input: string[]) {
  const crt = CRT();

  const cpu = CPU();

  cpu.loadProgram(input);

  cpu.run((cycle, register) => {
    const spritePosition = (cycle - 1) % crt.WIDTH;

    if (Math.abs(spritePosition - register) <= 1) {
      crt.drawPixel(cycle - 1, true);
    }
  });

  crt.drawScreen();
}

// const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

console.log(first(input)); // 14540
second(input); // EHZFZHCZ
