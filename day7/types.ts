export type Name = string;

export type File = {
  type: "file";
  name: Name;
  size: number;
};

export type Dir = {
  type: "dir";
  name: Name;
  size?: number;
  children: Map<Name, Node>;
};

export type Node = File | Dir;

type ListOperation = {
  type: "ls";
};

type ChangeDirOperation = {
  type: "cd";
  target: Name;
};

export type Operation = ListOperation | ChangeDirOperation;
