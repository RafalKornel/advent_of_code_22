import { calculateDistance } from "./utils.ts";
import { Point, GlobalCoordinate, Sensor } from "./types.ts";

function extractPosition(input: string): Point<GlobalCoordinate> {
  const tokens = input.split(" ");
  const xPart = tokens.at(-2);
  const yPart = tokens.at(-1);

  if (!xPart || !yPart) throw new Error(`Could not find x or y: ${input}`);

  const [_xLabel, xString] = xPart.replace(",", "").split("=");
  const [_yLabel, yString] = yPart.split("=");

  return [Number(xString), Number(yString)];
}

export function parseInput(input: string[]): Sensor[] {
  const sensors: Sensor[] = [];

  for (const line of input) {
    const [sensorPart, beaconPart] = line.split(": ");

    const sensorPosition = extractPosition(sensorPart);
    const beaconPosition = extractPosition(beaconPart);

    sensors.push({
      pos: sensorPosition,
      closestBeaconPos: beaconPosition,
      closestBeaconDistance: calculateDistance(sensorPosition, beaconPosition),
    });
  }

  return sensors;
}
