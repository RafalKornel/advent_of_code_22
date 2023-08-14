import { Valve, Tunnel } from "./Valve.ts";

export function parseInput(input: string[]): Valve[] {
  const valves: Valve[] = [];

  let i = 0;

  for(const line of input) {
    const [, name, , , flowRateStr, , , , , ...connectedValvesStr] = line.split(" ");

    const flowRate = Number(flowRateStr.replace(";", "").split("=")[1]);

    const tunnels: Tunnel[] = connectedValvesStr.map((valveStr) => ({
      to: valveStr.replaceAll(",", ""),
      cost: 1,
    }));

    const valve: Valve = {
      name,
      index: i,
      openCost: 1,
      flowRate,
      tunnels,
    };

    valves.push(valve);

    i++;
  }

  return valves;
}
