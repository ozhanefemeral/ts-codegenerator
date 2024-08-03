import { createFunctionCallBlock } from "generator/blocks/function-call";
import { createIfBlock } from "generator/blocks/if-block";
import { createWhileBlock } from "generator/blocks/while-block";
import { FunctionCallBlock, IfBlock, WhileLoopBlock } from "types/blocks";
import { CodeGeneratorState } from "types/generator";

describe("Advanced Block Nesting", () => {
  let initialState: CodeGeneratorState;

  beforeEach(() => {
    initialState = {
      blocks: [],
      variables: [],
      isAsync: false,
    };
  });

  test("creates while block inside if block", () => {
    let state = initialState;

    // Create the outer if block
    const { block: ifBlock, state: state1 } = createIfBlock("x > 0", [], state);
    state = state1;

    // Create a while block inside the if block
    const { block: whileBlock, state: state2 } = createWhileBlock(
      "y < 10",
      [],
      state,
      ifBlock
    );
    state = state2;

    expect(state.blocks).toHaveLength(1);
    expect(state.blocks[0]).toEqual({
      ...ifBlock,
      thenBlocks: [whileBlock],
    });
  });

  test("creates if block inside while block", () => {
    let state = initialState;

    // Create the outer while block
    const { block: whileBlock, state: state1 } = createWhileBlock(
      "x < 10",
      [],
      state
    );
    state = state1;

    // Create an if block inside the while block
    const { block: ifBlock, state: state2 } = createIfBlock(
      "y > 0",
      [],
      state,
      undefined,
      undefined,
      whileBlock
    );
    state = state2;

    expect(state.blocks).toHaveLength(1);
    expect(state.blocks[0]).toEqual({
      ...whileBlock,
      loopBlocks: [ifBlock],
    });
  });

  test("creates function call block inside if block, which is inside of a while block", () => {
    let state = initialState;

    // Create the outer while block
    const { block: whileBlock, state: state1 } = createWhileBlock(
      "x < 10",
      [],
      state
    );
    state = state1;

    // Create an if block inside the while block
    const { block: ifBlock, state: state2 } = createIfBlock(
      "y > 0",
      [],
      state,
      undefined,
      undefined,
      whileBlock
    );
    state = state2;

    // Create a function call block inside the if block
    const { block: funcBlock, state: state3 } = createFunctionCallBlock(
      { name: "doSomething", returnType: "void" },
      state,
      ifBlock
    );
    state = state3;

    expect(state.blocks).toHaveLength(1);
    const mainBlock = state.blocks[0] as WhileLoopBlock;
    expect(mainBlock.blockType).toBe("while");
    expect(mainBlock.loopBlocks).toHaveLength(1);

    const nestedIfBlock = mainBlock.loopBlocks[0] as IfBlock;
    expect(nestedIfBlock.blockType).toBe("if");
    expect(nestedIfBlock.thenBlocks).toHaveLength(1);

    const nestedFuncBlock = nestedIfBlock.thenBlocks[0] as FunctionCallBlock;
    expect(nestedFuncBlock.blockType).toBe("functionCall");
    expect(nestedFuncBlock.functionInfo.name).toBe("doSomething");
  });
});
