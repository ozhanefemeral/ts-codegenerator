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
  printNodes,
  findAndUpdateBlock,
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

export { generateCrud } from "./prisma/crud-generator";
export { PrismaParser, parsePrismaSchema } from "./prisma/prisma-parser";
export type {
  CrudConfig,
  CrudOutput,
  CrudOperation,
  ModelOperation,
} from "./types/prisma/crud";
export type {
  PrismaAttribute,
  PrismaEnum,
  PrismaField,
  PrismaModel,
  PrismaRelation,
  PrismaSchema,
  RelationType,
} from "./types/prisma/prisma";
