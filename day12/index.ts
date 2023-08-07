import { readTextFile } from "../utils.ts";
import { Node, Key } from "./types.ts";
import { parseInput } from "./parseInput.ts";

/** Returns array of distances to end point from each node */
function calculateShortestPaths(nodes: Node[], to: Node): number[] {
  const prev: Key[] = new Array(nodes.length).fill(-1);
  const seen: boolean[] = new Array(nodes.length).fill(false);
  const distances = new Array(nodes.length).fill(Infinity);

  const findSmallestUnvisited = (): number | null => {
    let smallest = Infinity;
    let index = -1;

    for (let i = 0; i < nodes.length; i++) {
      if (!seen[i] && distances[i] < smallest) {
        smallest = distances[i];
        index = i;
      }
    }

    return index === -1 ? null : index;
  };

  let curr: number | null = to.key;
  distances[curr] = 0;

  while (curr !== null) {
    const node = nodes[curr];
    const currDistance = distances[node.key];

    seen[curr] = true;

    for (const neighbourKey of node.neighbours) {
      if (nodes[neighbourKey] === undefined) {
        throw new Error(`Out of boundaries: ${neighbourKey}, ${nodes.length}`);
      }

      const neighbour = nodes[neighbourKey];
      const heightDiff = node.height - neighbour.height;

      const weight = heightDiff <= 1 ? 1 : Infinity;

      if (Number.isFinite(weight)) {
        const distanceThroughCurr = currDistance + weight;

        if (distances[neighbour.key] > distanceThroughCurr) {
          distances[neighbour.key] = distanceThroughCurr;
          prev[neighbour.key] = node.key;
        }

        if (!seen[curr]) {
          curr = node.key;
          continue;
        }
      }
    }

    curr = findSmallestUnvisited();
  }

  return distances;
}

function first(input: string[]) {
  const nodes = parseInput(input);

  const from = nodes.find(({ isStart }) => isStart);
  const to = nodes.find(({ isEnd }) => isEnd);

  if (!from || !to) throw new Error("Could not find start and end node");

  const distances = calculateShortestPaths(nodes, to);

  const steps = distances[from.key];

  console.log(`Shortest path: ${steps}`);
}

function second(input: string[]) {
  const nodes = parseInput(input);

  const to = nodes.find(({ isEnd }) => isEnd);

  if (!to) throw new Error("Could not find start and end node");

  const distances = calculateShortestPaths(nodes, to);

  let shortestPath = Infinity;
  let shortestPathStart = -1;

  for (const node of nodes) {
    if (node.height !== 0) continue;

    if (distances[node.key] < shortestPath) {
      shortestPath = distances[node.key];
      shortestPathStart = node.key;
    }
  }

  console.log(`Shortest path: ${shortestPath}, from: ${shortestPathStart}`);
}

const test_data = readTextFile("test_data.txt");
const input = readTextFile("input.txt");

first(input); // 437
second(input); // 430
