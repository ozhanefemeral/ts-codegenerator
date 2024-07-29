export * from "./module-parser";
export {
  createFunctionCall,
  createVariableWithFunctionCall,
  extractVariables,
  generateCode,
  blockToTypeScript,
  extractReturnType,
  findVariableByType,
  getUniqueVariableName,
  createFunctionCallBlock,
  functionCallBlockToTypeScript,
  ifBlockToTypeScript,
  createIfBlock,
  createWhileBlock,
  whileBlockToTypeScript,
  blocksToFlattenedNodes,
  blocksToTreeNodes,
  flattenTree,
  printTree,
} from "./generator";

export type {
  VariableInfoWithIndex,
  CodebaseInfo,
  FunctionInfo,
  ModuleInfoFields,
  TypeInfo,
  VariableInfo,
  FunctionCallBlock,
  ElseBlock,
  CodeGeneratorState,
  ElseIfBlock,
  IfBlock,
  CodeBlock,
  WhileLoopBlock,
  CodeNode,
  FlattenedNode,
  NestableNode,
  NonNestableNode,
  TreeNode,
} from "./types";

export { scanCodebase } from "./codebase-scanner";

export type { NextCodebaseInfo, ServerActionInfo } from "./nextjs";
export { scanNextjsCodebase, generateServerAction } from "./nextjs";
export * as NextJS from "./nextjs";
