import { readTextFile } from "../utils.ts";

type Knot = { x: number; y: number; next?: Knot };

type Direction = { x: number; y: number };

type DirectionKey = "U" | "R" | "D" | "L";

type Instruction = [DirectionKey, number];

function getStepDirection(direction: DirectionKey): Direction {
  switch (direction) {
    case "U":
      return { x: 0, y: 1 };
    case "D":
      return { x: 0, y: -1 };
    case "R":
      return { x: 1, y: 0 };
    case "L":
      return { x: -1, y: 0 };
  }
}

function parseInstruction(instructionInput: string): Instruction {
  const [direction, steps] = instructionInput.split(" ");

  return [direction, Number(steps)] as Instruction;
}

function getNextKnotStepDirection(knot: Knot): Direction {
  if (!knot.next) throw new Error("Tail found");

  const dx = knot.x - knot.next.x;
  const dy = knot.y - knot.next.y;

  const areOnSameRow = Math.abs(dx) === 2 && dy === 0;

  if (areOnSameRow) {
    return { x: dx > 0 ? 1 : -1, y: 0 };
  }

  const areOnSameCol = Math.abs(dy) === 2 && dx === 0;

  if (areOnSameCol) {
    return { x: 0, y: dy > 0 ? 1 : -1 };
  }

  const areTouching = Math.abs(dy) <= 1 && Math.abs(dx) <= 1;

  if (areTouching) {
    return { x: 0, y: 0 };
  }

  // Follow knot diagonally
  return { x: dx >= 0 ? 1 : -1, y: dy >= 0 ? 1 : -1 };
}

function run(head: Knot, input: string[]) {
  const visited = new Set<string>();

  function step(entity: Knot, by: Knot) {
    const { x, y } = by;

    entity.x += x;
    entity.y += y;
  }

  for (const line of input) {
    const [direction, steps] = parseInstruction(line);

    for (let i = 0; i < steps; i++) {
      const headDirection = getStepDirection(direction);

      let curr: Knot = head;

      step(curr, headDirection);

      while (curr.next) {
        const nextKnotStepDirection = getNextKnotStepDirection(curr);

        step(curr.next, nextKnotStepDirection);

        curr = curr.next;
      }

      // encountered tail
      visited.add(`${curr.x} | ${curr.y}`);
    }
  }

  return visited.size;
}

function first(input: string[]) {
  const tail: Knot = { x: 0, y: 0 };
  const head: Knot = { x: 0, y: 0, next: tail };

  return run(head, input);
}

function second(input: string[]) {
  const head: Knot = { x: 0, y: 0 };

  let curr = head;
  for (let i = 0; i < 9; i++) {
    curr.next = { x: 0, y: 0 };

    curr = curr.next;
  }

  return run(head, input);
}

const test_data = readTextFile("./test_data.txt");

const input = readTextFile("./input.txt");

console.log(first(input)); // 6243
console.log(second(input)); // 2630
