export type Crate = string;

export type StackId = string;
export type Stack = Crate[];
export type Stacks = Map<StackId, Stack>;

export type Instruction = {
  count: number;
  from: StackId;
  to: StackId;
};
