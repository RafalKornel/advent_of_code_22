import { getCharCode, isCapital, readTextFile } from "../utils.ts";

function calculateItemPriority(item: string): number {
  const charCode = getCharCode(item);

  const offset = isCapital(item) ? 27 : 1;

  const priority = charCode + offset;

  return priority;
}

function first(backpacks: string[]): number {
  const priorities: number[] = [];

  backpacksLoop: for (const backpack of backpacks) {
    const halfIndex = backpack.length / 2;

    const firstSet = new Set<string>();
    const secondSet = new Set<string>();

    for (let i = 0; i < halfIndex; i++) {
      firstSet.add(backpack[i]);
      secondSet.add(backpack[i + halfIndex]);
    }

    for (const item of firstSet) {
      if (!secondSet.has(item)) continue;

      // we've found item placed in both compartments

      priorities.push(calculateItemPriority(item));

      continue backpacksLoop;
    }
  }

  return priorities.reduce((prev, next) => prev + next, 0);
}

const ELVES_IN_GROUP = 3;

function second(backpacks: string[]): number {
  const priorities: number[] = [];

  if (backpacks.length % ELVES_IN_GROUP !== 0)
    throw new Error(
      `Backpacks couldn't be divided into groups by ${ELVES_IN_GROUP} elements`
    );

  const groupsCount = backpacks.length / ELVES_IN_GROUP;

  groupsLoop: for (let g = 0; g < groupsCount; g++) {
    const sets = new Array(ELVES_IN_GROUP).fill(0).map(() => new Set<string>());

    // Add items to sets
    for (let i = 0; i < ELVES_IN_GROUP; i++) {
      const backpack = backpacks[g * ELVES_IN_GROUP + i];
      const set = sets[i];

      for (const c of backpack) {
        set.add(c);
      }
    }

    const [firstSet, ...restSets] = sets;

    for (const item of firstSet) {
      const isCommonItem = restSets.every((set) => set.has(item));

      if (!isCommonItem) continue;

      // found common item;

      priorities.push(calculateItemPriority(item));

      continue groupsLoop;
    }
  }

  return priorities.reduce((prev, next) => prev + next, 0);
}

const testData = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

// console.log(first(lines));
console.log(second(input));
