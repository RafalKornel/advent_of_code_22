import { Point, Sensor, Bounds } from "./types.ts";

export function calculateDistance(p1: Point<any>, p2: Point<any>): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

export function getBoardBounds(sensors: Sensor[]): Bounds {
  const bounds: Bounds = {
    left: Infinity,
    right: -Infinity,
    top: Infinity,
    down: -Infinity,
    height: 0,
    width: 0,
  };

  for (const sensor of sensors) {
    const [x, y] = sensor.pos;

    if (x > bounds.right) {
      bounds.right = x;
    } else if (x < bounds.left) {
      bounds.left = x;
    }

    if (y > bounds.down) {
      bounds.down = y;
    } else if (y < bounds.top) {
      bounds.top = y;
    }

    const [beaconX, beaconY] = sensor.closestBeaconPos;

    if (beaconX > bounds.right) {
      bounds.right = beaconX;
    } else if (beaconX < bounds.left) {
      bounds.left = beaconX;
    }

    if (beaconY > bounds.down) {
      bounds.down = beaconY;
    } else if (beaconY < bounds.top) {
      bounds.top = beaconY;
    }
  }

  bounds.width = bounds.right - bounds.left;
  bounds.height = bounds.down - bounds.top;

  return bounds;
}
