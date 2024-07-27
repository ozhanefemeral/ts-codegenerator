import { CodeBlock } from "../../types/blocks";
import { FunctionInfo } from "../../types/common";
import { CodeGeneratorState } from "../../types/generator";
import { createFunctionCallBlock } from "../blocks/function-call";
import { createWhileBlock } from "../blocks/while-block";

describe("While Block Generator", () => {
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

  test("generates simple while block successfully", () => {
    const condition = "x < 10";
    const { block: dummyBlock, state: updatedState } = createFunctionCallBlock(
      dummyFunctionInfo,
      initialState
    );
    const loopBlocks: CodeBlock[] = [dummyBlock];

    const { block, state } = createWhileBlock(
      condition,
      loopBlocks,
      updatedState
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("while");
    expect(block.condition).toBe(condition);
    expect(block.loopBlocks).toEqual(loopBlocks);
    expect(block.index).toBe(1); // 0 is the dummy function block
    expect(state.blocks).toHaveLength(2);
    expect(state.blocks[1]).toBe(block);
  });

  test("generates nested while block successfully", () => {
    let currentState = initialState;

    // Create inner while block
    const { block: dummyBlock, state: state1 } = createFunctionCallBlock(
      dummyFunctionInfo,
      currentState
    );
    currentState = state1;

    const { block: innerWhileBlock, state: state2 } = createWhileBlock(
      "y < 5",
      [dummyBlock],
      currentState
    );
    currentState = state2;

    // Create outer while block
    const outerCondition = "x < 10";
    const { block, state } = createWhileBlock(
      outerCondition,
      [innerWhileBlock],
      currentState
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("while");
    expect(block.condition).toBe(outerCondition);
    expect(block.loopBlocks).toHaveLength(1);
    expect(block.loopBlocks[0]).toBe(innerWhileBlock);
    expect(block.index).toBe(2); // 0 is the dummy function block, 1 is the inner while block
    expect(state.blocks).toHaveLength(3);
    expect(state.blocks[2]).toBe(block);
  });

  test("creates multiple while blocks and updates state correctly", () => {
    let currentState = initialState;

    // Create first while block
    const { block: dummyBlock1, state: state1 } = createFunctionCallBlock(
      dummyFunctionInfo,
      currentState
    );
    currentState = state1;

    const { block: whileBlock1, state: state2 } = createWhileBlock(
      "x < 10",
      [dummyBlock1],
      currentState
    );
    currentState = state2;

    // Create second while block
    const { block: dummyBlock2, state: state3 } = createFunctionCallBlock(
      dummyFunctionInfo,
      currentState
    );
    currentState = state3;

    const { block: whileBlock2, state: finalState } = createWhileBlock(
      "y < 5",
      [dummyBlock2],
      currentState
    );

    expect(whileBlock1.index).toBe(1);
    expect(whileBlock2.index).toBe(3);
    expect(finalState.blocks).toHaveLength(4);
    expect(finalState.blocks[1]).toBe(whileBlock1);
    expect(finalState.blocks[3]).toBe(whileBlock2);
  });
});
