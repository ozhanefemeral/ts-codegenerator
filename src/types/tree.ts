import { CodeBlock } from "./blocks";

export interface TreeNode {
  children: TreeNode[];
  block: CodeBlock;
  isNestable: boolean;
  hierarchy: number;
}

export interface NestableNode extends TreeNode {
  isNestable: true;
}

export interface NonNestableNode extends TreeNode {
  isNestable: false;
}

export type CodeNode = NestableNode | NonNestableNode;

export interface FlattenedNode {
  block: CodeBlock;
  depth: number;
  isNestable: boolean;
}
