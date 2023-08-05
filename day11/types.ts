type MonkeyId = number;

export type StressLevel = number;

export type Operation = {
  right: "old" | number;
  operand: "*" | "+";
};

export type Test = {
  operation: "divisible";
  value: number;
};

export type Monkey = {
  id: MonkeyId;
  items: StressLevel[];
  itemsInspectedCount: number;
  operation: Operation;
  test: Test;
  trueBranchMonkey: MonkeyId;
  falseBranchMonkey: MonkeyId;
};
