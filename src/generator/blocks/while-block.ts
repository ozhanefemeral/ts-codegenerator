import {
  BlockAndState,
  CodeBlock,
  ElseBlock,
  ElseIfBlock,
  IfBlock,
  WhileLoopBlock,
} from "../../types/blocks";
import { CodeGeneratorState } from "../../types/generator";
import { factory, Statement } from "typescript";
import { blockToTypeScript } from "../block-generator";
import { countAllBlocks, findAndUpdateBlock } from "generator/utils";

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
  state: CodeGeneratorState,
  createInside?: IfBlock | ElseIfBlock | ElseBlock | WhileLoopBlock
): BlockAndState<WhileLoopBlock> {
  const index = countAllBlocks(state.blocks);

  const block: WhileLoopBlock = {
    condition,
    loopBlocks,
    index,
    blockType: "while",
  };

  let newBlocks: CodeBlock[];

  if (createInside) {
    newBlocks = findAndUpdateBlock(state.blocks, createInside.index, (b) => {
      switch (b.blockType) {
        case "if":
          return { ...b, thenBlocks: [...b.thenBlocks, block] };
        case "while":
          return { ...b, loopBlocks: [...b.loopBlocks, block] };
        case "else-if":
        case "else":
          return { ...b, blocks: [...(b.blocks || []), block] };
        default:
          throw new Error(
            `Unexpected block type creating inside: ${b.blockType}`
          );
      }
    });
  } else {
    newBlocks = [...state.blocks, block];
  }

  const newState: CodeGeneratorState = {
    ...state,
    blocks: newBlocks,
    isAsync: state.isAsync,
  };

  return { block, state: newState };
}
