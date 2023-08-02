import { Operation, Node, Name, Dir, File } from "./types.ts";

interface ITreeBuilder {
  build(input: string[]): Dir;
}

export class TreeBuilder implements ITreeBuilder {
  private _root: Dir;

  private _curr: Node;

  private _input: string[];

  constructor(input: string[]) {
    this._root = {
      type: "dir",
      name: "/",
      children: new Map<string, Node>(),
    } as Dir;

    this._curr = this._root;

    this._input = [...input];
  }

  build(): Dir {
    this._input.reverse();

    this._input.pop(); // we ignore initial `$ cd /`

    let currentLine = this._input.pop();

    const move = () => (currentLine = this._input.pop());

    while (currentLine) {
      const operation = TreeBuilder.parseOperation(currentLine);

      if (operation.type === "cd") {
        this.changeNode(operation.target);

        move();
        continue;
      }

      // If we are here it means current operation is "ls"
      move();

      while (currentLine && !TreeBuilder.isOperation(currentLine)) {
        const node = TreeBuilder.parseNode(currentLine);

        this.addChild(node);
        move();
      }
    }

    this.calculateFolderSizes();

    return this._root;
  }

  private changeNode(name: Name) {
    if (this._curr.type !== "dir")
      throw new Error(
        `this._Current element is not a directory: ${JSON.stringify(
          this._curr
        )}`
      );

    const child = this._curr.children.get(name);

    if (!child) {
      throw new Error(
        `Could not traverse to directory: ${JSON.stringify(this._curr)}`
      );
    }

    this._curr = child;
  }

  private addChild(child: Node) {
    if (this._curr.type !== "dir")
      throw new Error(
        `Could not add child to node - not a directory: ${JSON.stringify(
          this._curr
        )}`
      );

    this._curr.children.set(child.name, child);
    if (child.type === "dir") {
      // child.parent = this._curr;
      child.children.set("..", this._curr);
    }
  }

  private calculateFolderSizes() {
    const traverse = (node: Node): number => {
      // exit condition - leaf
      if (node.type === "file") return node.size;

      let sum = 0;

      // if directory has 0 children, sum will not be increased
      for (const [name, child] of node.children.entries()) {
        if (name === "..") continue;

        sum += traverse(child);
      }

      node.size = sum;

      return sum;
    };

    traverse(this._root);
  }

  static isOperation(line: string | undefined): boolean {
    return line?.[0] === "$";
  }

  static parseOperation(input: string): Operation {
    const tokens = input.split(" ");

    const [_dollarSign, command, target] = tokens;

    if (command === "ls") {
      return { type: "ls" } as Operation;
    } else if (command === "cd" && !!target) {
      return { type: "cd", target } as Operation;
    } else {
      throw new Error(`Unknown operation: ${input}`);
    }
  }

  static parseNode(input: string): Node {
    const tokens = input.split(" ");

    if (tokens[0] === "dir" && tokens[1]) {
      return {
        name: tokens[1],
        type: "dir",
        children: new Map<Name, Node>(),
      } as Dir;
    }

    // Entering file branch
    const size = Number(tokens[0]);

    if (!Number.isSafeInteger(size))
      throw new Error(`Wrong file size: ${input}`);

    const name = tokens[1];

    if (!name) throw new Error(`No name of file provided: ${input}`);

    return { name, size, type: "file" } as File;
  }
}
