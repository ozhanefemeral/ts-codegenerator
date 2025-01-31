import { FunctionInfo, VariableInfo } from "./common";
import { CodeGeneratorState } from "./generator";

export interface Block {
  index: number;
  comment?: string;
  blockType: string;
}

export interface FunctionCallBlock extends Block {
  functionInfo: FunctionInfo;
  parameters?: VariableInfo[];
  returnVariable: VariableInfo;
  isAsync: boolean;
  blockType: "functionCall";
}

export interface IfBlock extends Block {
  condition: string;
  thenBlocks: CodeBlock[];
  elseIfBlocks?: ElseIfBlock[];
  elseBlock?: ElseBlock;
  blockType: "if";
}

export interface ElseIfBlock extends Block {
  condition: string;
  blocks: CodeBlock[];
  blockType: "else-if";
}

export interface ElseBlock extends Block {
  blocks: CodeBlock[];
  blockType: "else";
}

export interface WhileLoopBlock extends Block {
  condition: string;
  loopBlocks: CodeBlock[];
  blockType: "while";
}

// Add more block types as implemented
export type CodeBlock =
  | FunctionCallBlock
  | IfBlock
  | WhileLoopBlock
  | ElseBlock
  | ElseIfBlock;

export interface BlockAndState<T extends Block> {
  block: T;
  state: CodeGeneratorState;
}
