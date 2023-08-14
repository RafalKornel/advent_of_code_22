import { Valve, DistancesMatrix, Name } from "./Valve.ts";

export function calculateDistancesMatrix(valves: Valve[]): DistancesMatrix {
  const nameIndexMap = new Map<Name, number>();

  for(let i = 0;i < valves.length;i++) {
    const valve = valves[i];

    nameIndexMap.set(valve.name, i);
  }

  const distances: DistancesMatrix = new Array(valves.length)
    .fill(0)
    .map(() => new Array(valves.length).fill(Infinity));

  for(let i = 0;i < valves.length;i++) {
    distances[i][i] = 0;

    const valve = valves[i];

    for(const edge of valve.tunnels) {
      const j = nameIndexMap.get(edge.to)!;

      distances[i][j] = edge.cost;
    }
  }

  for(let k = 0;k < valves.length;k++) {
    for(let i = 0;i < valves.length;i++) {
      for(let j = 0;j < valves.length;j++) {
        const distThroughK = distances[i][k] + distances[k][j];

        if(distances[i][j] > distThroughK) {
          distances[i][j] = distThroughK;
        }
      }
    }
  }

  return distances;
}
