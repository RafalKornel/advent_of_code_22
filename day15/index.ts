import { readTextFile } from "../utils.ts";
import { calculateDistance, getBoardBounds } from "./utils.ts";
import { parseInput } from "./parseInput.ts";
import { Sensor } from "./types.ts";

function first(input: string[], row: number) {
  const sensors = parseInput(input);
  const bounds = getBoardBounds(sensors);

  let unavailableSpots = 0;

  const y = row;
  xLoop: for (let x = bounds.left; x < bounds.right; x++) {
    // x and y are now global coordinates

    for (let s = 0; s < sensors.length; s++) {
      const sensor = sensors[s];

      const dist = calculateDistance(sensor.pos, [x, y]);

      if (dist <= sensor.closestBeaconDistance) {
        unavailableSpots++;
        continue xLoop;
      }
    }
  }

  console.log(unavailableSpots);

  return unavailableSpots;
}

/** The idea here is to iterate over rows, and for each row do set of operations:
 * 1) find all sensors that reach current row
 * 2) calculate slice (left and right position for sensor's overlap)
 * 3) sort slices by left bound ascending
 * 
 * Now there are 3 configurations:
 *  - first slice's left is greater than 0 - that means all slices start after position 0,
 *    then uncovered point has x = 0
 *  - last slice's right is lower than boundary - that means all slices ends before end of the row,
 *    then uncovered point has x = size
 *  - previous slice right is lower than next slice left - that means there is a gap between slices, 
 *    then x = previous slice left - 1
 */
function findUncoveredPoint(
  sensors: Sensor[],
  size: number
): [x: number, y: number] | null {
  for (let y = 0; y < size; y++) {
    const ranges = [];

    for (const sensor of sensors) {
      const distFromRow = Math.abs(sensor.pos[1] - y);

      if (distFromRow < sensor.closestBeaconDistance) {
        const width = sensor.closestBeaconDistance - distFromRow;
        const left = sensor.pos[0] - width;
        const right = sensor.pos[0] + width;

        ranges.push([left, right]);
      }
    }

    ranges.sort((a, b) => a[0] - b[0]);

    const [first] = ranges;

    let prevLeft = first[0];
    let prevRight = first[1];

    if (prevLeft > 0) {
      return [0, y];
    }

    for (const [left, right] of ranges) {
      if (left > prevRight) {
        return [left - 1, y];
      }

      if (right > prevRight) {
        prevLeft = left;
        prevRight = right;
      }
    }

    if (prevRight < size) {
      return [prevRight + 1, y];
    }
  }

  return null;
}

function second(input: string[], size: number) {
  const sensors = parseInput(input);

  const point = findUncoveredPoint(sensors, size);

  if (!point) throw new Error("Could not find point!");

  const frequency = point[0] * size + point[1];

  console.log(frequency);

  return frequency;
}

const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

// first(test_data, 10);
// first(input, 2_000_000);

// second(test_data, 20);
second(input, 4_000_000);
