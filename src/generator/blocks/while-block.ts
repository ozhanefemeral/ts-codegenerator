import { BlockAndState, CodeBlock, WhileLoopBlock } from "../../types/blocks";
import { CodeGeneratorState } from "../../types/generator";
import { factory, Statement } from "typescript";
import { blockToTypeScript } from "../block-generator";

export function whileBlockToTypeScript(
  block: WhileLoopBlock,
  state: CodeGeneratorState
): Statement {
  const loopBody = factory.createBlock(
    block.loopBlocks.map((b) => blockToTypeScript(b, state))
  );

  return factory.createWhileStatement(
    factory.createIdentifier(block.condition),
    loopBody
  );
}

export function createWhileBlock(
  condition: string,
  loopBlocks: CodeBlock[],
  state: CodeGeneratorState
): BlockAndState<WhileLoopBlock> {
  const index = state.blocks.length;

  const block: WhileLoopBlock = {
    condition,
    loopBlocks,
    index,
    blockType: "while",
  };

  const newState: CodeGeneratorState = {
    ...state,
    blocks: [...state.blocks, block],
  };

  return { block, state: newState };
}