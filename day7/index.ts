import { buildDirectoriesSizeMinHeap } from "./buildDirectoriesSizeMinHeap.ts";
import { Dir } from "./types.ts";

export function first(root: Dir): number {
  const THRESHOLD = 100000;

  const directoriesOverThreshold: Dir[] = [];

  const traverse = (dir: Dir) => {
    if (dir.size && dir.size <= THRESHOLD) {
      directoriesOverThreshold.push(dir);
    }

    for (const [name, child] of dir.children.entries()) {
      if (name === "..") continue;

      if (child.type === "dir") {
        traverse(child);
      }
    }
  };

  traverse(root);

  return directoriesOverThreshold.reduce(
    (prev, next) => prev + (next.size || 0),
    0
  );
}

export function second(root: Dir): number {
  const TOTAL_SPACE = 70000000;

  const MIN_REQUIRED_SPACE = 30000000;

  const rootSize = root.size!;

  const freeMemory = TOTAL_SPACE - rootSize;

  const directoriesSizeMinHeap = buildDirectoriesSizeMinHeap(root);

  let currentFolderSize = directoriesSizeMinHeap.remove();

  while (
    currentFolderSize &&
    freeMemory + currentFolderSize < MIN_REQUIRED_SPACE
  ) {
    currentFolderSize = directoriesSizeMinHeap.remove();
  }

  if (currentFolderSize === undefined)
    throw new Error("Could not find folder.");

  return currentFolderSize;
}
