import { Node, Dir } from "./types.ts";

export function print(root: Dir) {
  const getNodeInfo = ({ name, size, type }: Node): string =>
    `${name}, (${type}, size=${size || "-"})`;

  const printNode = (node: Node, depth: number): string => {
    const nodeInfo = getNodeInfo(node);

    return `${"\t".repeat(depth)} - ${nodeInfo}`;
  };

  const res: string[] = [];

  const traverse = (node: Node, depth: number) => {
    res.push(printNode(node, depth));

    if (node.type === "file") {
      return;
    }

    // dir branch
    for (const [name, child] of node.children.entries()) {
      if (name === "..") continue;

      traverse(child, depth + 1);
    }
  };

  traverse(root, 0);

  console.log(res.join("\n"));
}
