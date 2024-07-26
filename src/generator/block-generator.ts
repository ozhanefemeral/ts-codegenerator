import { functionCallBlockToTypeScript } from "./blocks/function-call";
import { CodeBlock } from "types";
import { CodeGeneratorState } from "types/generator";
import { Statement } from "typescript";
import { ifBlockToTypeScript } from "./blocks/if-block";
import { whileBlockToTypeScript } from "./blocks/while-block";

export function blockToTypeScript(
  block: CodeBlock,
  state: CodeGeneratorState
): Statement {
  switch (block.blockType) {
    case "functionCall":
      return functionCallBlockToTypeScript(block, state);
    case "if":
      return ifBlockToTypeScript(block, state);
    case "while":
      return whileBlockToTypeScript(block, state);
  }
}
