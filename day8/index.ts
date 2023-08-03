import { readTextFile } from "../utils.ts";
import {
  createInitialVisibilityGrid,
  createInitialScenicScoreGrid,
  combineScenicScoreGrids,
  combineVisibilityGrids,
  transpose,
} from "./utils.ts";
import { Grid, Height, VisibilityGrid, ScenicScoreGrid } from "./types.ts";

function parseInput(input: string[]): Grid {
  const grid: Grid = [];

  for (const line of input) {
    grid.push(line.split("").map(Number));
  }

  return grid;
}

/**
 * This function traverses grid and builds up result. 
 * It's O(h * w) time-wise
 * and O(h * w) memory-wise
 */ 
function traverse(grid: Grid): {
  visibilityGrid: VisibilityGrid;
  scenicScoreGrid: ScenicScoreGrid;
} {
  const rowsCount = grid.length;
  const colsCount = grid[0].length;

  const visibilityGrid = createInitialVisibilityGrid(rowsCount, colsCount);

  const scenicScoreGrid = createInitialScenicScoreGrid(rowsCount, colsCount);

  for (let i = 0; i < grid.length; i++) {
    const arr = grid[i];

    let leftBiggest = 0;
    let rightBiggest = 0;

    type VisibilityDistance = number;

    const leftSeenMap = new Map<Height, VisibilityDistance>();
    const rightSeenMap = new Map<Height, VisibilityDistance>();

    for (let i = 0; i <= 9; i++) {
      leftSeenMap.set(i, -1);
      rightSeenMap.set(i, -1);
    }

    for (let leftIndex = 0; leftIndex < arr.length; leftIndex++) {
      const leftHeight = arr[leftIndex];

      if (leftHeight > leftBiggest) {
        leftBiggest = leftHeight;
        visibilityGrid[i][leftIndex] = true;
      }

      let biggestLeftIndex = 0;

      for (let height = leftHeight; height <= 9; height++) {
        const idx = leftSeenMap.get(height)!;

        if (idx === -1 || idx > leftIndex) continue;

        if (idx > biggestLeftIndex) {
          biggestLeftIndex = idx;
        }
      }

      scenicScoreGrid[i][leftIndex][0] = leftIndex - biggestLeftIndex;

      leftSeenMap.set(leftHeight, leftIndex);
    }

    for (let rightIndex = arr.length - 1; rightIndex > 0; rightIndex--) {
      const rightHeight = arr[rightIndex];

      if (rightHeight > rightBiggest) {
        rightBiggest = rightHeight;
        visibilityGrid[i][rightIndex] = true;
      }

      let biggestRightIndex = arr.length - 1;

      for (let i = rightHeight; i <= 9; i++) {
        const idx = rightSeenMap.get(i)!;

        if (idx === -1 || idx < rightIndex) continue;

        if (idx < biggestRightIndex) {
          biggestRightIndex = idx;
        }
      }

      scenicScoreGrid[i][rightIndex][1] = biggestRightIndex - rightIndex;

      rightSeenMap.set(rightHeight, rightIndex);
    }
  }

  return { visibilityGrid, scenicScoreGrid };
}

function first(input: string[]): [number, number] {
  const rows: Grid = parseInput(input);
  const cols: Grid = transpose(rows);

  const {
    visibilityGrid: rowsVisibilityGrid,
    scenicScoreGrid: rowsScenicScoreGrid,
  } = traverse(rows);
  const {
    visibilityGrid: colsVisibilityGrid,
    scenicScoreGrid: colsScenicScoreGrid,
  } = traverse(cols);

  const combinedVisibilityGrid = combineVisibilityGrids(
    rowsVisibilityGrid,
    colsVisibilityGrid
  );

  const visibleTrees = combinedVisibilityGrid.reduce(
    (prev, next) => prev + next.reduce((p, n) => p + Number(n), 0),
    0
  );

  const scenicScoreMasterGrid = combineScenicScoreGrids(
    rowsScenicScoreGrid,
    colsScenicScoreGrid
  );

  let biggestScenicScore = 0;

  for (const row of scenicScoreMasterGrid) {
    for (const score of row) {
      if (score > biggestScenicScore) {
        biggestScenicScore = score;
      }
    }
  }

  return [visibleTrees, biggestScenicScore];
}

const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

const res = first(input);

console.log(res); // [1820, 385112]
