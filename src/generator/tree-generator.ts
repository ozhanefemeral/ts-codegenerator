import { CodeBlock, CodeNode, FlattenedNode } from "../types";

export const blockToTreeNode = (
  block: CodeBlock,
  hierarchy: number = 0
): CodeNode => {
  switch (block.blockType) {
    case "if":
      return {
        block,
        isNestable: true,
        children: [
          ...blocksToTreeNodes(block.thenBlocks, hierarchy + 1),
          ...(block.elseIfBlocks?.flatMap((elseIf) =>
            blocksToTreeNodes([elseIf], hierarchy + 1)
          ) || []),
          ...(block.elseBlock
            ? blocksToTreeNodes([block.elseBlock], hierarchy + 1)
            : []),
        ],
        hierarchy,
      };
    case "while":
      return {
        block,
        isNestable: true,
        children: blocksToTreeNodes(block.loopBlocks, hierarchy + 1),
        hierarchy,
      };
    case "else-if":
    case "else":
      return {
        block,
        isNestable: true,
        children: blocksToTreeNodes(block.blocks, hierarchy + 1),
        hierarchy,
      };
    default:
      return {
        block,
        isNestable: false,
        children: [],
        hierarchy,
      };
  }
};

export const blocksToTreeNodes = (
  blocks: CodeBlock[],
  hierarchy: number = 0
): CodeNode[] => {
  return blocks.map((block) => blockToTreeNode(block, hierarchy));
};

export const flattenTree = (
  node: CodeNode,
  depth: number = 0
): FlattenedNode[] => {
  const flatNode: FlattenedNode = {
    block: node.block,
    depth,
    isNestable: node.isNestable,
  };

  if (!node.isNestable) {
    return [flatNode];
  }

  return [
    flatNode,
    ...node.children.flatMap((child) => flattenTree(child, depth + 1)),
  ];
};

export const blocksToFlattenedNodes = (
  blocks: CodeBlock[]
): FlattenedNode[] => {
  const treeNodes = blocksToTreeNodes(blocks);
  return treeNodes.flatMap((node) => flattenTree(node));
};

export function printTree(
  node: CodeNode,
  prefix: string = "",
  isLast: boolean = true
) {
  console.log(prefix + (isLast ? "└── " : "├── ") + node.block.blockType);

  const childPrefix = prefix + (isLast ? "    " : "│   ");
  const childrenCount = node.children.length;

  node.children.forEach((child, index) => {
    const isLastChild = index === childrenCount - 1;
    printTree(child, childPrefix, isLastChild);
  });
}

export function printNodes(nodes: CodeNode[]) {
  nodes.forEach((node, index) => {
    printTree(node);
    console.log();
  });
}
