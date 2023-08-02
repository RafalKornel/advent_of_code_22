import { readTextFile } from "../utils.ts";

function findStartOfPacket(signal: string, windowLength: number): number {
  if (signal.length < windowLength) throw new Error("Signal too small!");

  for (let i = 0; i < signal.length - windowLength; i++) {
    const window = signal.slice(i, i + windowLength);

    const set = new Set(window);

    if (set.size === windowLength) {
      return i + windowLength;
    }
  }

  return 0;
}

// const testData = readTextFile("./test_data.txt");

// testData.forEach((testLine) => {
//   console.log(first(testLine));
// });

const first = (signal: string) => findStartOfPacket(signal, 4);
const second = (signal: string) => findStartOfPacket(signal, 14);

const [input] = readTextFile("./input.txt");

console.log(second(input));
