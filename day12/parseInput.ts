import { getCharCode } from "../utils.ts";
import { Node, Key } from "./types.ts";

function getIndex(
  x: number,
  y: number,
  width: number,
  height: number
): number | undefined {
  if (x < 0 || x >= width || y < 0 || y >= height) return undefined;

  return x + width * y;
}

const START_SYMBOL = "S";

const END_SYMBOL = "E";

function getHeight(char: string): number {
  if (char === START_SYMBOL) return 0;
  if (char === END_SYMBOL) return getCharCode("z");

  return getCharCode(char);
}

export function parseInput(input: string[]): Node[] {
  let key = 0;
  const nodes: Node[] = [];

  const height = input.length;
  const width = input[0].length;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const char = input[y][x];

      const left = getIndex(x - 1, y, width, height);
      const top = getIndex(x, y - 1, width, height);
      const right = getIndex(x + 1, y, width, height);
      const down = getIndex(x, y + 1, width, height);

      nodes.push({
        key,
        height: getHeight(char),
        isEnd: char === END_SYMBOL,
        isStart: char === START_SYMBOL,
        neighbours: [left, top, right, down].filter(Boolean) as Key[],
      });

      key++;
    }
  }

  // for (let y = 0; y < input.length; y++) {
  //   let line = "";
  //   for (let x = 0; x < input[y].length; x++) {
  //     line += ` ${
  //       nodes.find(({ key }) => key === getIndex(x, y, width, height))?.height
  //     } `;
  //   }

  //   line += "\n";

  //   console.log(line);
  // }
  
  return nodes;
}
