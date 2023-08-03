export type Add = {
  type: "addx";
  cycles: number;
  value: number;
};

export type Noop = {
  type: "noop";
  cycles: number;
};

export type Instruction = Noop | Add;

export type ClockCallback = (cycle: number, register: number) => void;
