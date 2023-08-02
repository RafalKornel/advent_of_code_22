import { Dir } from "./types.ts";

// https://github.com/RafalKornel/algs/blob/main/structures/heap/Heap.ts
import { Heap } from "https://raw.githubusercontent.com/RafalKornel/algs/main/structures/heap/Heap.ts";

export function buildDirectoriesSizeMinHeap(root: Dir): Heap<"min"> {
  const heap = new Heap("min");

  // build MinHeap with directories size
  const traverse = (dir: Dir) => {
    if (dir.size) {
      heap.add(dir.size);
    }

    for (const [name, child] of dir.children.entries()) {
      if (name === "..") continue;

      if (child.type === "dir") {
        traverse(child);
      }
    }
  };

  traverse(root);

  return heap;
}
