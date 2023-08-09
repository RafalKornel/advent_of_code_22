export type LocalCoordinate = number;

export type GlobalCoordinate = number;

export type Point<Coordinate extends number> = [x: Coordinate, y: Coordinate];

export type Sensor = {
  pos: Point<GlobalCoordinate>;
  closestBeaconPos: Point<GlobalCoordinate>;
  closestBeaconDistance: number;
};

export type Bounds = {
  left: GlobalCoordinate;
  right: GlobalCoordinate;
  top: GlobalCoordinate;
  down: GlobalCoordinate;
  width: number;
  height: number;
};
