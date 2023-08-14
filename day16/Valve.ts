
export type Name = string;
export type Tunnel = {
  to: Name;
  cost: number;
};

export type Valve = {
  name: Name;
  index: number;
  flowRate: number;
  openCost: number;
  tunnels: Tunnel[];
};
export type DistancesMatrix = number[][];
