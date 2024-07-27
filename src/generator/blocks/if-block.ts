import {
  BlockAndState,
  CodeBlock,
  ElseBlock,
  ElseIfBlock,
  IfBlock,
} from "types";
import { CodeGeneratorState } from "types/generator";
import { factory, Statement } from "typescript";
import { blockToTypeScript } from "../block-generator";

export function ifBlockToTypeScript(
  block: IfBlock,
  state: CodeGeneratorState
): Statement {
  const thenStatement = factory.createBlock(
    block.thenBlocks.map((b) => blockToTypeScript(b, state))
  );

  let elseStatement: Statement | undefined;

  if (block.elseIfBlocks && block.elseIfBlocks.length > 0) {
    elseStatement = createElseIfChain(
      block.elseIfBlocks,
      state,
      block.elseBlock
    );
  } else if (block.elseBlock) {
    elseStatement = createElseBlock(block.elseBlock, state);
  }

  return factory.createIfStatement(
    factory.createIdentifier(block.condition),
    thenStatement,
    elseStatement
  );
}

function createElseIfChain(
  elseIfBlocks: ElseIfBlock[],
  state: CodeGeneratorState,
  finalElseBlock?: ElseBlock
): Statement {
  let currentStatement: Statement | undefined;

  for (let i = elseIfBlocks.length - 1; i >= 0; i--) {
    const elseIfBlock = elseIfBlocks[i];
    if (elseIfBlock) {
      const thenStatement = factory.createBlock(
        elseIfBlock.blocks.map((b) => blockToTypeScript(b, state))
      );

      currentStatement = factory.createIfStatement(
        factory.createIdentifier(elseIfBlock.condition),
        thenStatement,
        currentStatement
      );
    }
  }

  if (finalElseBlock) {
    const elseStatement = createElseBlock(finalElseBlock, state);
    const firstElseIfBlock = elseIfBlocks[0];
    if (firstElseIfBlock) {
      return factory.createIfStatement(
        factory.createIdentifier(firstElseIfBlock.condition),
        factory.createBlock(
          firstElseIfBlock.blocks.map((b) => blockToTypeScript(b, state))
        ),
        elseStatement
      );
    }
  }

  return currentStatement ?? factory.createEmptyStatement();
}

function createElseBlock(
  elseBlock: ElseBlock,
  state: CodeGeneratorState
): Statement {
  return factory.createBlock(
    elseBlock.blocks.map((b) => blockToTypeScript(b, state))
  );
}

export function createIfBlock(
  condition: string,
  thenBlocks: CodeBlock[],
  state: CodeGeneratorState,
  elseIfBlocks?: ElseIfBlock[],
  elseBlock?: ElseBlock
): BlockAndState<IfBlock> {
  const index = state.blocks.length;

  const block: IfBlock = {
    condition,
    thenBlocks,
    elseIfBlocks,
    elseBlock,
    index,
    blockType: "if",
  };

  const newState: CodeGeneratorState = {
    ...state,
    blocks: [...state.blocks, block],
  };

  return { block, state: newState };
}
