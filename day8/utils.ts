import { Grid, Height, VisibilityGrid, ScenicScoreGrid } from "./types.ts";

export function transpose(grid: Grid): Grid {
  const transposed: Grid = [];

  for (let x = 0; x < grid[0].length; x++) {
    const col: Height[] = [];

    for (let y = 0; y < grid.length; y++) {
      col.push(grid[y][x]);
    }

    transposed.push(col);
  }

  return transposed;
}

export function createInitialVisibilityGrid(
  rowsCount: number,
  colsCount: number
): VisibilityGrid {
  const visibilityGrid: VisibilityGrid = [];

  const isOnBorder = (x: number, y: number): boolean => {
    return x === 0 || y === 0 || x === colsCount - 1 || y === rowsCount;
  };

  // fill visibility grid with false values...
  for (let y = 0; y < rowsCount; y++) {
    visibilityGrid.push([]);

    for (let x = 0; x < colsCount; x++) {
      visibilityGrid[y].push(isOnBorder(x, y)); // ...expect for borders, where we set it to true
    }
  }

  return visibilityGrid;
}

export function createInitialScenicScoreGrid(
  rowsCount: number,
  colsCount: number
): ScenicScoreGrid {
  const grid: ScenicScoreGrid = [];

  for (let y = 0; y < rowsCount; y++) {
    grid.push([]);

    for (let x = 0; x < colsCount; x++) {
      grid[y].push([0, 0]);
    }
  }

  return grid;
}

export function combineVisibilityGrids(
  rows: VisibilityGrid,
  cols: VisibilityGrid
): VisibilityGrid {
  const result: VisibilityGrid = [];

  for (let y = 0; y < rows.length; y++) {
    result.push([]);

    for (let x = 0; x < rows[y].length; x++) {
      const rowValue = rows[y][x];
      const colValue = cols[x][y];

      result[y].push(rowValue || colValue);
    }
  }

  return result;
}

export function combineScenicScoreGrids(
  rows: ScenicScoreGrid,
  cols: ScenicScoreGrid
): Grid {
  const result: Grid = [];

  for (let y = 0; y < rows.length; y++) {
    result.push([]);

    for (let x = 0; x < rows[y].length; x++) {
      const rowValue = rows[y][x];
      const colValue = cols[x][y];

      const score = rowValue[0] * rowValue[1] * colValue[0] * colValue[1];

      result[y].push(score);
    }
  }

  return result;
}
