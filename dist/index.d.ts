import { Node, SourceFile } from 'ts-morph';
import { Statement, VariableStatement, CallExpression, AwaitExpression } from 'typescript';

interface VariableInfo {
    name: string;
    type: string;
}
interface FunctionInfo {
    name: string;
    returnType: string;
    jsDocComment?: string;
    code?: string;
    variables?: VariableInfo[];
    returnVariable?: VariableInfo;
    parameters?: VariableInfo[];
}
interface VariableInfoWithIndex extends VariableInfo {
    index: number;
}
interface TypeInfo {
    name: string;
    properties?: Array<{
        name: string;
        type: string;
    }>;
    methods?: Array<FunctionInfo>;
    extends?: string[];
    implements?: string[];
}

interface Block {
    index: number;
    comment?: string;
    blockType: string;
}
interface FunctionCallBlock extends Block {
    functionInfo: FunctionInfo;
    parameters?: VariableInfo[];
    returnVariable: VariableInfo;
    isAsync: boolean;
    blockType: "functionCall";
}
type CodeBlock = FunctionCallBlock;

interface CodebaseInfo {
    functions: FunctionInfo[];
    types: TypeInfo[];
}
interface ModuleInfoFields {
    fileName: string;
    interfaces: string[];
    functions: FunctionInfo[];
    fileContent: string;
    usedTypes: string[];
}

declare function getFunctionInfoFromNode(node: Node): FunctionInfo | null;
declare function parseFunctionsFromText(sourceCode: string): {
    functionsInfo: FunctionInfo[];
    usedTypes: string[];
};

declare function getFunctionVariables(sourceFile: SourceFile, functionName: string): VariableInfo[] | undefined;

interface CodeGeneratorState {
    blocks: CodeBlock[];
    variables: VariableInfoWithIndex[];
    isAsync: boolean;
}

declare function blockToTypeScript(block: CodeBlock, state: CodeGeneratorState | {
    variables: VariableInfoWithIndex[];
}): Statement;

declare function generateCode(blocks: CodeBlock[]): string;

/**
 * Finds a variable by type.
 * @param variables Available variables.
 * @param type Type to search for.
 * @param latest Whether to return the latest matching variable.
 * @param toIndex Upper bound index to search.
 * @returns Matching variable information or undefined.
 */
declare function findVariableByType(variables: VariableInfoWithIndex[], type: string, latest?: boolean, toIndex?: number): VariableInfoWithIndex | undefined;
/**
 * Generates a unique variable name.
 * @param baseName The base name for the variable.
 * @param variables Existing variables.
 * @returns A unique variable name.
 */
declare function getUniqueVariableName(baseName: string, variables: VariableInfoWithIndex[]): string;
/**
 * Extracts the return type from a function's return type string.
 * @param returnType The return type string of a function.
 * @returns The extracted return type.
 */
declare function extractReturnType(returnType: string | undefined): string;
/**
 * Extracts variables from function information.
 * @param functionInfos Array of function information.
 * @returns Array of variable information with index.
 */
declare function extractVariables(functionInfos: FunctionInfo[]): VariableInfoWithIndex[];

/**
 * Creates a variable declaration with a function call.
 *
 * @param {FunctionCallBlock} block - The block containing information about the function to call.
 * @param {VariableInfoWithIndex[]} variables - The available variables.
 * @return {VariableStatement} The created variable declaration with a function call.
 */
declare function createVariableWithFunctionCall(block: FunctionCallBlock, state: CodeGeneratorState | {
    variables: VariableInfoWithIndex[];
}): VariableStatement;
/**
 * Creates a function call expression.
 * @param functionInfo Information about the function to call.
 * @param variables Available variables to use as parameters.
 * @param index Current index in the function sequence.
 * @returns A CallExpression or AwaitExpression.
 */
declare function createFunctionCall(functionInfo: FunctionInfo, variables: VariableInfoWithIndex[], index: number): CallExpression | AwaitExpression;
/**
 * Creates a function call block.
 *
 * @param {FunctionInfo} functionInfo - Information about the function to call.
 * @param {CodeGeneratorState} state - The current state of the code generator.
 * @return {FunctionCallBlock} The created function call block.
 */
declare function createFunctionCallBlock(functionInfo: FunctionInfo, state: CodeGeneratorState): FunctionCallBlock;
/**
 * Converts a function call block into a TypeScript variable statement.
 *
 * @param {FunctionCallBlock} block - The function call block to convert.
 * @param {CodeGeneratorState | { variables: VariableInfoWithIndex[] }} state - The state of the code generator.
 * @return {VariableStatement} The TypeScript variable statement representing the function call block.
 */
declare function functionCallBlockToTypeScript(block: FunctionCallBlock, state: CodeGeneratorState | {
    variables: VariableInfoWithIndex[];
}): VariableStatement;

declare function scanCodebase(projectPath: string): CodebaseInfo;

interface ServerActionInfo extends FunctionInfo {
    filePath: string;
}
interface NextCodebaseInfo {
    serverActions: ServerActionInfo[];
}

declare function scanNextjsCodebase(projectPath: string): NextCodebaseInfo;
declare function analyzeNextjsSourceFiles(sourceFiles: SourceFile[]): NextCodebaseInfo;

declare function generateServerAction(info: ServerActionInfo): string;

type index_NextCodebaseInfo = NextCodebaseInfo;
type index_ServerActionInfo = ServerActionInfo;
declare const index_analyzeNextjsSourceFiles: typeof analyzeNextjsSourceFiles;
declare const index_generateServerAction: typeof generateServerAction;
declare const index_scanNextjsCodebase: typeof scanNextjsCodebase;
declare namespace index {
  export { type index_NextCodebaseInfo as NextCodebaseInfo, type index_ServerActionInfo as ServerActionInfo, index_analyzeNextjsSourceFiles as analyzeNextjsSourceFiles, index_generateServerAction as generateServerAction, index_scanNextjsCodebase as scanNextjsCodebase };
}

export { type Block, type CodebaseInfo, type FunctionCallBlock, type FunctionInfo, type ModuleInfoFields, type NextCodebaseInfo, index as NextJS, type ServerActionInfo, type TypeInfo, type VariableInfo, type VariableInfoWithIndex, blockToTypeScript, createFunctionCall, createFunctionCallBlock, createVariableWithFunctionCall, extractReturnType, extractVariables, findVariableByType, functionCallBlockToTypeScript, generateCode, generateServerAction, getFunctionInfoFromNode, getFunctionVariables, getUniqueVariableName, parseFunctionsFromText, scanCodebase, scanNextjsCodebase };
