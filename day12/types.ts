
export type Key = number;

export type Node = {
  key: Key;
  height: number;
  isStart: boolean;
  isEnd: boolean;
  neighbours: Key[];
};
