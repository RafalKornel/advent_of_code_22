import { readTextFile } from "../utils.ts";
import { Valve } from "./Valve.ts";
import { calculateDistancesMatrix } from "./calculateDistancesMatrix.ts";
import { parseInput } from "./parseInput.ts";

function first(input: string[]) {
  const valves = parseInput(input);

  const distances = calculateDistancesMatrix(valves);

  const workingValvesSet = new Set<Valve>(
    valves.filter(({ flowRate }) => flowRate !== 0)
  );

  const traverse = (
    timeLeft: number,
    currentValve: Valve,
    openedValves: Set<Valve>
  ): number => {
    const openedValvesThreshold = [...openedValves].reduce(
      (p, n) => p + n.flowRate,
      0
    );

    const unopenedValves = [...workingValvesSet].filter(
      (valve) => !openedValves.has(valve)
    );

    const hasUnopenedValves = !!unopenedValves.length;

    if (!hasUnopenedValves) {
      const pressure = openedValvesThreshold * timeLeft;

      return pressure;
    }

    const subResults: number[] = [];

    for (const valve of unopenedValves) {
      const travelCost = distances[currentValve.index][valve.index];

      const totalCost = travelCost + valve.openCost;

      if (totalCost <= timeLeft) {
        const pressure = traverse(
          timeLeft - totalCost,
          valve,
          new Set(openedValves).add(valve)
        );

        subResults.push(pressure + totalCost * openedValvesThreshold);
      }
    }

    if (subResults.length === 0) return openedValvesThreshold * timeLeft;

    subResults.sort((a, b) => b - a);

    return subResults[0];
  };

  const result = traverse(30, valves[0], new Set<Valve>());

  console.log(result);

  return result;
}

function second(input: string[]) {
  const valves = parseInput(input);

  const distances = calculateDistancesMatrix(valves);

  const workingValvesSet = new Set<Valve>(
    valves.filter(({ flowRate }) => flowRate !== 0)
  );

  const traverse = (
    timeLeft: number,
    currentValve: Valve,
    openedValves: Set<Valve>
  ): number => {
    const openedValvesThreshold = [...openedValves].reduce(
      (p, n) => p + n.flowRate,
      0
    );

    const unopenedValves = [...workingValvesSet].filter(
      (valve) => !openedValves.has(valve)
    );

    const hasUnopenedValves = !!unopenedValves.length;

    if (!hasUnopenedValves) {
      const pressure = openedValvesThreshold * timeLeft;

      return pressure;
    }

    const subResults: number[] = [];

    for (let i = 0; i < unopenedValves.length; i++) {
      for (let j = i; j < unopenedValves.length; j++) {
        if (i === j) continue;

        const valveA = unopenedValves[i];
        const valveB = unopenedValves[j];

        const costA =
          distances[currentValve.index][valveA.index] + valveA.openCost;
        const costB =
          distances[currentValve.index][valveB.index] + valveB.openCost;

        const furtherValve = costA > costB ? valveA : valveB;
        const closerValve = costA > costB ? valveB : valveA;

        const smallerCost = costA > costB ? costB : costA;
        const biggerCost = costA > costB ? costA : costB;

        if (biggerCost <= timeLeft) {
          const pressure = traverse(
            timeLeft - biggerCost,
            furtherValve,
            new Set(openedValves).add(closerValve).add(furtherValve)
          );

          subResults.push(
            pressure +
              biggerCost * openedValvesThreshold +
              (biggerCost - smallerCost) * closerValve.flowRate
          );
        }

        // if (smallerCost <= timeLeft) {
        //   const pressure = traverse(
        //     timeLeft - smallerCost,
        //     closerValve,
        //     new Set(openedValves).add(closerValve)
        //   );

        //   subResults.push(pressure + smallerCost * openedValvesThreshold);
        // }
      }
    }

    if (subResults.length === 0) return openedValvesThreshold * timeLeft;

    subResults.sort((a, b) => b - a);

    return subResults[0];
  };

  const result = traverse(26, valves[0], new Set<Valve>());

  console.log(result);

  return result;
}

const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

// first(input); // 1641
second(test_data);
