import {
  createPrinter,
  factory,
  NewLineKind,
  NodeFlags,
  PrinterOptions,
  Statement,
  SyntaxKind,
} from "typescript";
import { CodeBlock, CodeGeneratorState } from "../types";
import { blockToTypeScript } from "./block-generator";

export function generateCode(blocks: CodeBlock[]): string {
  const state: CodeGeneratorState = {
    blocks: blocks,
    variables: [],
    isAsync: blocks.some((block) =>
      block.blockType === "functionCall" ? block.isAsync : false
    ),
  };

  const statements: Statement[] = blocks.map((block) =>
    blockToTypeScript(block, state)
  );
  const functionName = "generatedFunction";

  const isAsync = state.isAsync;

  const functionDeclaration = factory.createFunctionDeclaration(
    isAsync ? [factory.createModifier(SyntaxKind.AsyncKeyword)] : undefined,
    undefined,
    functionName,
    undefined,
    [],
    undefined,
    factory.createBlock(statements, true)
  );

  const sourceFile = factory.createSourceFile(
    [functionDeclaration],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None
  );

  const printerOptions: PrinterOptions = {
    newLine: NewLineKind.LineFeed,
    removeComments: false,
    omitTrailingSemicolon: false,
    noEmitHelpers: true,
  };

  const printer = createPrinter(printerOptions);

  return printer.printFile(sourceFile);
}
