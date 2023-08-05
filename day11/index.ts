import { readTextFile } from "../utils.ts";
import { Operation, Test, Monkey, StressLevel } from "./types.ts";
import { parseInput } from "./parseInput.ts";

function evaluateOperation(operation: Operation, value: StressLevel): number {
  const right: number = operation.right === "old" ? value : operation.right;

  if (operation.operand === "*") {
    return (value * right) as number;
  }

  if (operation.operand === "+") {
    return (value + right) as number;
  }

  throw new Error(`Unsupported operation: ${operation}`);
}

function testItem(test: Test, stressLevel: number): boolean {
  if (test.operation === "divisible") {
    return stressLevel % test.value === 0;
  }

  return false;
}

function run(
  monkeys: Monkey[],
  reduceStressStrategy: (stressLevel: StressLevel) => StressLevel,
  roundsCount: number
) {
  for (let round = 0; round < roundsCount; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];

      while (monkey.items.length) {
        let currItem = monkey.items.shift();

        if (currItem === undefined) break;

        monkey.itemsInspectedCount++;
        currItem = evaluateOperation(monkey.operation, currItem);

        currItem = reduceStressStrategy(currItem);

        const testResult = testItem(monkey.test, currItem);

        const nextMonkeyIndex = testResult
          ? monkey.trueBranchMonkey
          : monkey.falseBranchMonkey;

        monkeys[nextMonkeyIndex].items.push(currItem);
      }
    }
  }

  monkeys.sort((a, b) => b.itemsInspectedCount - a.itemsInspectedCount);

  const monkeyBusiness =
    monkeys[0].itemsInspectedCount * monkeys[1].itemsInspectedCount;

  return monkeyBusiness;
}

const input = readTextFile("./test_data.txt");

const firstMonkeys = parseInput(input);
const first = () =>
  run(firstMonkeys, (stressLevel) => Math.floor(stressLevel / 3), 20);

console.log("first: ", first()); // 78678

const secondMonkeys = parseInput(input);
const PRIMES_PRODUCT = secondMonkeys
  .map((m) => m.test.value)
  .filter(Boolean)
  .reduce((p, n) => p * n, 1);

const second = () =>
  run(secondMonkeys, (stressLevel) => stressLevel % PRIMES_PRODUCT, 10000);

console.log("second: ", second()); // 15333249714
