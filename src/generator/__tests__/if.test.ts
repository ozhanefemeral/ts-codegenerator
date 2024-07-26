import { CodeBlock } from "../../types/blocks";
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
    const thenBlocks: CodeBlock[] = [
      createFunctionCallBlock(dummyFunctionInfo, initialState),
    ];

    const result = createIfBlock(
      condition,
      thenBlocks,
      initialState,
      undefined,
      undefined
    );

    expect(result).toBeDefined();
    expect(result.blockType).toBe("if");
    expect(result.condition).toBe(condition);
    expect(result.thenBlocks).toEqual(thenBlocks);
    expect(result.elseIfBlocks).toBeUndefined();
    expect(result.elseBlock).toBeUndefined();
    expect(result.index).toBe(1); // 0 is the dummy function block
  });

  test("generates if-else if-else block successfully", () => {
    const condition = "x > 0";
    const thenBlocks: CodeBlock[] = [
      createFunctionCallBlock(dummyFunctionInfo, initialState),
    ];
    const elseIfBlocks = [
      {
        condition: "x < 0",
        blocks: [createFunctionCallBlock(dummyFunctionInfo, initialState)],
      },
    ];
    const elseBlock = {
      blocks: [createFunctionCallBlock(dummyFunctionInfo, initialState)],
    };

    const result = createIfBlock(
      condition,
      thenBlocks,
      initialState,
      elseIfBlocks,
      elseBlock
    );

    expect(result).toBeDefined();
    expect(result.blockType).toBe("if");
    expect(result.condition).toBe(condition);
    expect(result.thenBlocks).toEqual(thenBlocks);
    expect(result.elseIfBlocks).toEqual(elseIfBlocks);
    expect(result.elseBlock).toEqual(elseBlock);
    expect(result.index).toBe(3); // 0, 1, 2 are the dummy function blocks
  });

  test("generates nested if block successfully", () => {
    const outerCondition = "x > 0";
    const innerIfBlock = createIfBlock(
      "y > 0",
      [createFunctionCallBlock(dummyFunctionInfo, initialState)],
      initialState,
      [
        {
          condition: "y < 0",
          blocks: [createFunctionCallBlock(dummyFunctionInfo, initialState)],
        },
      ],
      {
        blocks: [createFunctionCallBlock(dummyFunctionInfo, initialState)],
      }
    );

    const result = createIfBlock(
      outerCondition,
      [innerIfBlock],
      initialState,
      undefined,
      undefined
    );

    expect(result).toBeDefined();
    expect(result.blockType).toBe("if");
    expect(result.condition).toBe(outerCondition);
    expect(result.thenBlocks).toHaveLength(1);
    expect(result.thenBlocks[0]).toBe(innerIfBlock);
    expect(result.elseIfBlocks).toBeUndefined();
    expect(result.elseBlock).toBeUndefined();
    expect(result.index).toBe(4); // 0, 1, 2, 3 are the dummy function blocks and inner if block
  });

  test("updates state correctly after creating if block", () => {
    const condition = "x > 0";
    const thenBlocks: CodeBlock[] = [
      createFunctionCallBlock(dummyFunctionInfo, initialState),
    ];

    const result = createIfBlock(
      condition,
      thenBlocks,
      initialState,
      undefined,
      undefined
    );

    expect(initialState.blocks).toHaveLength(2);
    expect(initialState.blocks[1]).toBe(result);
  });
});
