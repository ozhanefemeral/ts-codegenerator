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
    const loopBlocks: CodeBlock[] = [
      createFunctionCallBlock(dummyFunctionInfo, initialState),
    ];

    const result = createWhileBlock(condition, loopBlocks, initialState);

    expect(result).toBeDefined();
    expect(result.blockType).toBe("while");
    expect(result.condition).toBe(condition);
    expect(result.loopBlocks).toEqual(loopBlocks);
    expect(result.index).toBe(1); // 0 is the dummy function block
  });

  test("generates nested while block successfully", () => {
    const outerCondition = "x < 10";
    const innerWhileBlock = createWhileBlock(
      "y < 5",
      [createFunctionCallBlock(dummyFunctionInfo, initialState)],
      initialState
    );

    const result = createWhileBlock(
      outerCondition,
      [innerWhileBlock],
      initialState
    );

    expect(result).toBeDefined();
    expect(result.blockType).toBe("while");
    expect(result.condition).toBe(outerCondition);
    expect(result.loopBlocks).toHaveLength(1);
    expect(result.loopBlocks[0]).toBe(innerWhileBlock);
    expect(result.index).toBe(2); // 0 is the dummy function block, 1 is the inner while block
  });

  test("updates state correctly after creating while block", () => {
    const condition = "x < 10";
    const loopBlocks: CodeBlock[] = [
      createFunctionCallBlock(dummyFunctionInfo, initialState),
    ];

    const result = createWhileBlock(condition, loopBlocks, initialState);

    expect(initialState.blocks).toHaveLength(2);
    expect(initialState.blocks[1]).toBe(result);
  });
});
