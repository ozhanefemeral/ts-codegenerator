import { functionCallBlockToTypeScript } from "./blocks/function-call";
import { CodeBlock } from "types";
import { CodeGeneratorState } from "types/generator";
import { Statement } from "typescript";
import { ifBlockToTypeScript } from "./blocks/if-block";

export function blockToTypeScript(
  block: CodeBlock,
  state: CodeGeneratorState
): Statement {
  switch (block.blockType) {
    case "functionCall":
      return functionCallBlockToTypeScript(block, state);
    case "if":
      return ifBlockToTypeScript(block, state);
  }
}
