import { readTextFile } from "../utils.ts";
import { Pair, Result, Signal } from "./types.ts";
import { parseInput } from "./parseInput.ts";
import { compare } from "./compare.ts";
import { BinarySearchTree } from "./BinarySearchTree.ts";

function first(input: string[]) {
  const signals = parseInput(input);

  if (signals.length % 2 !== 0)
    throw new Error(`Input does not containt pairs!`);

  const pairs: Pair[] = [];

  for (let i = 0; i < signals.length; i += 2) {
    const left = signals[i];
    const right = signals[i + 1];

    pairs.push([left, right]);
  }

  const results: Result[] = [];
  const pairsInOrderIndices: number[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const orderOfPair = compare(...pairs[i]);

    results.push(orderOfPair);

    if (orderOfPair === Result.InOrder) pairsInOrderIndices.push(i + 1);
  }

  const sum = pairsInOrderIndices.reduce((p, n) => p + n, 0);

  console.log(sum);
}

type SignalWithIndex = {
  signal: Signal;
  index: number; // should be unique
};

/** For the second part we will use binary search tree - we'll construct
 * a BST and then traverse it in order. function `compare` is function that will
 * determine where to put our child node
 */
function second(input: string[]) {
  const signals = parseInput(input);

  const firstDividerPacket = [[2]];
  const secondDividerPacket = [[6]];

  const firstDividerOriginalIndex = signals.push(firstDividerPacket) - 1;
  const secondDividerOriginalIndex = signals.push(secondDividerPacket) - 1;

  const bst = new BinarySearchTree<SignalWithIndex>((a, b) =>
    compare(a.signal, b.signal)
  );

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];

    bst.add({ index: i, signal });
  }

  const inOrderList = bst.getList();

  let firstDividerIndex = -1;
  let secondDividerIndex = -1;

  for (let i = 0; i < inOrderList.length; i++) {
    const originalIndex = inOrderList[i].index;

    if (originalIndex === firstDividerOriginalIndex) {
      firstDividerIndex = i + 1;
    } else if (originalIndex === secondDividerOriginalIndex) {
      secondDividerIndex = i + 1;
    }
  }

  console.log(firstDividerIndex * secondDividerIndex);
}

const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

// first(input); // 5393

second(test_data); // 26712
