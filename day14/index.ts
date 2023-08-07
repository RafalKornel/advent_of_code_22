/** I have no clue how I got this messy here, God please forgive me for commiting such crimes on this code */

import { readTextFile } from "../utils.ts";

type GlobalCoordinate = number;
type LocalCoordinate = number;

type Position<Coordinate extends number> = [x: Coordinate, y: Coordinate];

enum Entity {
  Air = ".",
  Rock = "#",
  Sand = "o",
  StaticSand = "x",
  SandSource = "+",
}

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WorldType = Entity[][];

enum SimulationOutcome {
  Overflow = "overflow",
  Settled = "settled",
  ReachedTop = "top",
  Unknown = "idk",
}

class World {
  private _world: WorldType;
  private _lowestRockPos: Position<LocalCoordinate>;
  private _sandParticles: Position<LocalCoordinate>[];
  private _sandSource: Position<LocalCoordinate>;
  private _settledSandCount: number;

  constructor(
    private readonly bounds: Bounds,
    private readonly hasBottom: boolean,
    sandSource: Position<LocalCoordinate>
  ) {
    this._world = this.createEmptyWorld(bounds);
    this._lowestRockPos = [0, 0] as Position<LocalCoordinate>;
    this._sandParticles = [];
    this._settledSandCount = 0;

    this._sandSource = this.convertToLocal(sandSource);
  }

  createEmptyWorld({ width, height }: Bounds): WorldType {
    const world: WorldType = new Array(height)
      .fill(0)
      .map((_) => new Array(width).fill(Entity.Air));

    return world;
  }

  addEntity(entity: Entity, position: Position<GlobalCoordinate>) {
    const local = this.convertToLocal(position);

    // console.log(local);

    this.addEntityFromLocal(entity, local);
  }

  private addEntityFromLocal(entity: Entity, pos: Position<LocalCoordinate>) {
    const [x, y] = pos;

    if (entity === Entity.Sand) {
      // console.log(this._world[y][x], x, y);
      if (this._world[y][x] !== Entity.Air) return;
      this._sandParticles.push([x, y]);
    }

    // console.log(x, y, entity);

    this._world[y][x] = entity;
  }

  private isAvailable([x, y]: Position<LocalCoordinate>): boolean {
    if (x >= this._world[0].length) return false;

    if (x < 0) return false;

    if (y >= this._world.length) return false;

    if (y < 0) return false;

    return this._world[y][x] === Entity.Air;
  }

  generateSandParticle() {
    const [x, y] = this._sandSource;

    this.addEntityFromLocal(Entity.Sand, [x, y]);
  }

  simulateSand(): SimulationOutcome {
    while (this._sandParticles.length) {
      let [x, y] = this._sandParticles.pop()!;
      let newX = x;
      let newY = y;

      this._world[y][x] = Entity.Air;

      if (this.isAvailable([x, y + 1])) {
        newY = y + 1;
      } else if (this.isAvailable([x - 1, y + 1])) {
        newX = x - 1;
        newY = y + 1;
      } else if (this.isAvailable([x + 1, y + 1])) {
        newX = x + 1;
        newY = y + 1;
      } else {
        this.addEntityFromLocal(Entity.StaticSand, [x, y]);

        this._settledSandCount++;

        if (x === this._sandSource[0] && y === this._sandSource[1]) {
          return SimulationOutcome.ReachedTop;
        } else {
          return SimulationOutcome.Settled;
        }
      }

      if (this.hasBottom && y > this._lowestRockPos[1]) {
        return SimulationOutcome.Overflow;
      }

      this._world[y][x] = Entity.Air;

      this.addEntityFromLocal(Entity.Sand, [newX, newY]);
    }

    return SimulationOutcome.Unknown;
  }

  private convertToLocal([
    x,
    y,
  ]: Position<GlobalCoordinate>): Position<LocalCoordinate> {
    const local: Position<LocalCoordinate> = [
      x - this.bounds.x,
      y - this.bounds.y,
    ];

    return local;
  }

  print() {
    for (let i = 0; i < this._world.length; i++) {
      const row = this._world[i];

      const line = `${i}: ${row.join("")}`;

      // console.log(line);
    }
  }

  get settledSandCount() {
    return this._settledSandCount;
  }
}

function parseInput(input: string[], hasBottom = false): World {
  const rocks: Position<GlobalCoordinate>[] = [];

  for (const line of input) {
    const patchKeyPoints = line
      .split(" -> ")
      .map(
        (chunk) =>
          chunk.split(",").map((v) => Number(v)) as Position<GlobalCoordinate>
      );

    for (let i = 0; i < patchKeyPoints.length - 1; i++) {
      const [xStart, yStart] = patchKeyPoints[i];
      const [xEnd, yEnd] = patchKeyPoints[i + 1];

      if (xStart === xEnd) {
        const yDiff = yEnd - yStart;
        const sign = yDiff / Math.abs(yDiff);

        for (let y = 0; y <= Math.abs(yDiff); y++) {
          rocks.push([xStart, yStart + sign * y]);
        }
      } else {
        const xDiff = xEnd - xStart;
        const sign = xDiff / Math.abs(xDiff);

        for (let x = 0; x <= Math.abs(xDiff); x++) {
          rocks.push([xStart + sign * x, yStart]);
        }
      }
    }
  }

  let highestPoint: Position<GlobalCoordinate> = [0, 0];

  for (const [x, y] of rocks) {
    if (y > highestPoint[1]) {
      highestPoint = [x, y];
    }
  }

  const yBounds = [0, highestPoint[1] + 2];

  const xBounds = [500 - yBounds[1], 500 + yBounds[1]];

  const width = xBounds[1] - xBounds[0];
  const height = yBounds[1] - yBounds[0] + 1;

  const bounds: Bounds = {
    x: xBounds[0],
    y: yBounds[0],
    width: width,
    height: height,
  };

  const sandSource: Position<GlobalCoordinate> = [500, 0];

  const world = new World(bounds, hasBottom, sandSource);

  for (const rockPos of rocks) {
    world.addEntity(Entity.Rock, rockPos);
  }

  // bottom
  for (let i = 0; i < width; i++) {
    world.addEntity(Entity.Rock, [xBounds[0] + i, yBounds[1]]);
  }

  return world;
}

function run(input: string[], hasBottom: boolean) {
  const world = parseInput(input, hasBottom);

  world.print();

  world.generateSandParticle();

  world.print();

  let simulationResult: SimulationOutcome = SimulationOutcome.Unknown;

  while (
    simulationResult !== SimulationOutcome.Overflow &&
    simulationResult !== SimulationOutcome.ReachedTop
  ) {
    simulationResult = world.simulateSand();

    if (simulationResult === SimulationOutcome.Settled) {
      world.generateSandParticle();
    }
  }

  console.log(world.settledSandCount);
}

const first = (input: string[]) => run(input, false);
const second = (input: string[]) => run(input, true);

const test_data = readTextFile("./test_data.txt");
const input = readTextFile("./input.txt");

first(input);
second(input);
