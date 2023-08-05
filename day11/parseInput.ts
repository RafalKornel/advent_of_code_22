import { Monkey, Operation, Test } from "./types.ts";

export function parseInput(input: string[]): Monkey[] {
  const MONKEY_INPUT_LENGTH = 7;

  const monkeys: Monkey[] = [];

  const monkeysCount = input.length / MONKEY_INPUT_LENGTH;

  if (monkeysCount % 1 !== 0) throw new Error("Invalid input.");

  for (let i = 0; i < monkeysCount; i++) {
    const baseIndex = i * MONKEY_INPUT_LENGTH;

    const monkeyIndex = Number(
      input[baseIndex + 0].split(" ")[1].split(":")[0]
    );

    const operationString = input[baseIndex + 2]
      .split(": ")[1]
      .replaceAll("new", "result");

    const [_new, _eqSign, left, operand, right] = operationString.split(" ");

    if (operand !== "*" && operand !== "+") {
      throw new Error(`Unsupported operand: ${left}`);
    }

    const operation: Operation = {
      right: right === "old" ? right : Number(right),
      operand,
    };

    const testValueString = input[baseIndex + 3].split(" ").at(-1);

    if (!testValueString) throw new Error(`Could not find test value`);

    const test: Test = {
      operation: "divisible",
      value: Number(testValueString),
    };

    const startingItems = input[baseIndex + 1]
      .split(":")[1]
      .split(",")
      .map((v) => v.trim())
      .map((v) => Number(v));

    const trueBranchMonkey = Number(input[baseIndex + 4].split(" ").at(-1));
    const falseBranchMonkey = Number(input[baseIndex + 5].split(" ").at(-1));

    const monkey: Monkey = {
      id: monkeyIndex,
      operation,
      items: startingItems,
      test,
      falseBranchMonkey,
      trueBranchMonkey,
      itemsInspectedCount: 0,
    };

    monkeys.push(monkey);
  }

  return monkeys;
}
