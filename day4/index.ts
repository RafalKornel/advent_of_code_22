import { readTextFile } from "../utils.ts";

// .234.....  2-4
// .....678.  6-8

// .23......  2-3
// ...45....  4-5

// ....567..  5-7
// ......789  7-9

// .2345678.  2-8
// ..34567..  3-7

// .....6...  6-6
// ...456...  4-6

// .23456...  2-6
// ...45678.  4-8

type Range = [low: number, high: number];

function parseElfInput(input: string): Range {
  const [lowRaw, highRaw] = input.split("-");

  const low = Number(lowRaw);
  const high = Number(highRaw);

  if (!Number.isFinite(low) || !Number.isFinite(high))
    throw new Error(`Wrong input: [${lowRaw}, ${highRaw}]. Expected numbers`);

  return [low, high] as Range;
}

function isContaining(rangeA: Range, rangeB: Range): boolean {
  const [lowA, highA] = rangeA;
  const [lowB, highB] = rangeB;

  const aContainsB = lowB >= lowA && highB <= highA;

  if (aContainsB) return true;

  const bContainsA = lowA >= lowB && highA <= highB;

  if (bContainsA) return true;

  return false;
}

function isOverlapping(rangeA: Range, rangeB: Range): boolean {
  const [lowA, highA] = rangeA;
  const [lowB, highB] = rangeB;

  if (lowB > highA) return false;

  if (lowA > highB) return false;

  return true;
}

function countElves(
  input: string[],
  strategy: (a: Range, b: Range) => boolean
): number {
  let result = 0;

  for (const line of input) {
    const [firstElfInput, secondElfInput] = line.split(",");

    const firstElfRange = parseElfInput(firstElfInput);
    const secondElfRange = parseElfInput(secondElfInput);

    if (strategy(firstElfRange, secondElfRange)) {
      result++;
    }
  }

  return result;
}

const first = (input: string[]) => countElves(input, isContaining);
const second = (input: string[]) => countElves(input, isOverlapping);

const input = readTextFile("./input.txt");

console.log("First part answer: ", first(input));
console.log("Second part answer: ", second(input));
