import { FunctionInfo, VariableInfo } from "./common";

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

export interface ElseIfBlock {
  condition: string;
  blocks: CodeBlock[];
}

export interface ElseBlock {
  blocks: CodeBlock[];
}

export interface WhileLoopBlock extends Block {
  condition: string;
  loopBlocks: CodeBlock[];
  blockType: "while";
}

// Add more block types as implemented
export type CodeBlock = FunctionCallBlock | IfBlock | WhileLoopBlock;
