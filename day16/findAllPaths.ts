import { MAX_TIME } from "./index.ts";
import { Valve, Name } from "./Valve.ts";

export function findAllPaths(valves: Valve[], from: Name) {
  const valvesMap = new Map<Name, Valve>();

  valves.forEach((valve) => {
    valvesMap.set(valve.name, valve);
  });

  const visitedValves: Valve[] = [];
  // const visitedValvesSet = new Set<Name>();
  const pathsPressure = new Map<string, number>();

  function traverse(curr: Valve, minute: number, pressureEscaped: number) {
    console.log(curr.name, minute, pressureEscaped);

    // minute += 1;
    if(minute === MAX_TIME) {
      const path = visitedValves.reduce((p, n) => p + n.name, "");

      pathsPressure.set(path, pressureEscaped);

      return;
    }

    const currPressureIncrement = visitedValves.reduce(
      (p, n) => p + n.flowRate,
      0
    );

    // visitedValvesSet.add(curr.name);
    visitedValves.push(curr);

    // const visitedAllValves = visitedValvesSet.size === valves.length;
    // if (visitedAllValves) {
    //   const path = visitedValves.reduce((p, n) => p + n.name, "");
    //   const remainingPressure = currPressureIncrement * (MAX_TIME - minute);
    //   pathsPressure.set(path, remainingPressure);
    // }
    for(const tunnel of curr.tunnels) {
      // if (visitedValvesSet.has(tunnel.to)) {
      //   continue;
      // }
      const nextValve = valvesMap.get(tunnel.to)!;

      traverse(nextValve, minute + 1, pressureEscaped + currPressureIncrement);
    }

    visitedValves.pop();
    // visitedValvesSet.delete(curr.name);
  }

  traverse(valvesMap.get(from)!, 0, 0);

  console.log(pathsPressure);
}
