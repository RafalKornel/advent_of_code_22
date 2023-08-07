import { CompareCallback, Result } from "./types.ts";

type Node<T> = {
  value: T;
  left?: Node<T>;
  right?: Node<T>;
};

export class BinarySearchTree<T> {
  private _root: Node<T> | null;

  constructor(private compare: CompareCallback<T>) {
    this._root = null;
  }

  add(value: T): boolean {
    if (this._root === null) {
      this._root = { value };

      return true;
    }

    return this.addRecursively(this._root, value);
  }

  getList(): T[] {
    const list: T[] = [];

    const traverse = (node: Node<T> | undefined) => {
      if (!node) {
        return;
      }

      traverse(node.left);

      list.push(node.value);

      traverse(node.right);
    };

    traverse(this._root || undefined);

    return list;
  }

  private addRecursively(node: Node<T>, value: T): boolean {
    const order = this.compare(value, node.value);

    if (order === Result.Unknown) {
      throw new Error(
        `Unknown order: ${JSON.stringify(value)} | ${JSON.stringify(
          node.value
        )}`
      );
    }

    if (order === Result.InOrder) {
      if (node.left === undefined) {
        node.left = { value };
        return true;
      }

      return this.addRecursively(node.left, value);
    }

    if (order === Result.NotInOrder) {
      if (node.right === undefined) {
        node.right = { value };
        return true;
      }

      return this.addRecursively(node.right, value);
    }

    return false;
  }
}
