// https://adventofcode.com/2022/day/6

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

export const first = (signal: string) => findStartOfPacket(signal, 4);
export const second = (signal: string) => findStartOfPacket(signal, 14);
