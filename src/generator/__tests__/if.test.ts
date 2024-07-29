import { CodeBlock, ElseBlock, ElseIfBlock } from "../../types/blocks";
import { FunctionInfo } from "../../types/common";
import { CodeGeneratorState } from "../../types/generator";
import { createFunctionCallBlock } from "../blocks/function-call";
import { createIfBlock } from "../blocks/if-block";

describe("If Block Generator", () => {
  let initialState: CodeGeneratorState;
  let dummyFunctionInfo: FunctionInfo;

  beforeEach(() => {
    initialState = {
      blocks: [],
      variables: [],
      isAsync: false,
    };
    dummyFunctionInfo = {
      name: "dummyFunction",
      returnType: "void",
    };
  });

  test("generates simple if block successfully", () => {
    const condition = "x > 0";
    const { block: dummyBlock, state: updatedState } = createFunctionCallBlock(
      dummyFunctionInfo,
      initialState
    );
    const thenBlocks: CodeBlock[] = [dummyBlock];

    const { block, state } = createIfBlock(
      condition,
      thenBlocks,
      updatedState,
      undefined,
      undefined
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("if");
    expect(block.condition).toBe(condition);
    expect(block.thenBlocks).toEqual(thenBlocks);
    expect(block.elseIfBlocks).toBeUndefined();
    expect(block.elseBlock).toBeUndefined();
    expect(block.index).toBe(1); // 0 is the dummy function block
    expect(state.blocks).toHaveLength(2);
    expect(state.blocks[1]).toBe(block);
  });

  test("generates if-else if-else block successfully", () => {
    const condition = "x > 0";
    let currentState = initialState;
    const thenBlocks: CodeBlock[] = [];
    const elseIfBlocks: ElseIfBlock[] = [];
    const elseBlockBlocks: CodeBlock[] = [];

    // Create blocks for then, else-if, and else
    for (let i = 0; i < 3; i++) {
      const { block, state } = createFunctionCallBlock(
        dummyFunctionInfo,
        currentState
      );
      currentState = state;
      if (i === 0) thenBlocks.push(block);
      else if (i === 1)
        elseIfBlocks.push({
          condition: "x < 0",
          blocks: [block],
          blockType: "else-if",
        });
      else elseBlockBlocks.push(block);
    }

    const elseBlock: ElseBlock = { blocks: elseBlockBlocks, blockType: "else" };

    const { block, state } = createIfBlock(
      condition,
      thenBlocks,
      currentState,
      elseIfBlocks,
      elseBlock
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("if");
    expect(block.condition).toBe(condition);
    expect(block.thenBlocks).toEqual(thenBlocks);
    expect(block.elseIfBlocks).toEqual(elseIfBlocks);
    expect(block.elseBlock).toEqual(elseBlock);
    expect(block.index).toBe(3); // 0, 1, 2 are the dummy function blocks
    expect(state.blocks).toHaveLength(4);
    expect(state.blocks[3]).toBe(block);
  });

  test("generates nested if block successfully", () => {
    let currentState = initialState;

    // Create inner if block
    const { block: dummyBlock, state: state1 } = createFunctionCallBlock(
      dummyFunctionInfo,
      currentState
    );
    currentState = state1;

    const { block: innerIfBlock, state: state2 } = createIfBlock(
      "y > 0",
      [dummyBlock],
      currentState,
      [
        {
          condition: "y < 0",
          blocks: [dummyBlock],
          blockType: "else-if",
        },
      ],
      {
        blocks: [dummyBlock],
        blockType: "else",
      }
    );
    currentState = state2;

    // Create outer if block
    const outerCondition = "x > 0";
    const { block, state } = createIfBlock(
      outerCondition,
      [innerIfBlock],
      currentState,
      undefined,
      undefined
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("if");
    expect(block.condition).toBe(outerCondition);
    expect(block.thenBlocks).toHaveLength(1);
    expect(block.thenBlocks[0]).toBe(innerIfBlock);
    expect(block.elseIfBlocks).toBeUndefined();
    expect(block.elseBlock).toBeUndefined();
    expect(block.index).toBe(2); // 0 is the dummy function block, 1 is the inner if block
    expect(state.blocks).toHaveLength(3);
    expect(state.blocks[2]).toBe(block);
  });
});
