import { FunctionInfo } from "../../types/common";
import { CodeGeneratorState } from "../../types/generator";
import { createFunctionCallBlock } from "../blocks/function-call";

describe("Function Call Block Generator", () => {
  let initialState: CodeGeneratorState;
  let functionInfo: FunctionInfo;

  beforeEach(() => {
    initialState = {
      blocks: [],
      variables: [],
      isAsync: false,
    };
    functionInfo = {
      name: "testFunction",
      returnType: "string",
      parameters: [
        { name: "param1", type: "number" },
        { name: "param2", type: "boolean" },
      ],
    };
  });

  test("generates function call block successfully", () => {
    const { block, state } = createFunctionCallBlock(
      functionInfo,
      initialState
    );

    expect(block).toBeDefined();
    expect(block.blockType).toBe("functionCall");
    expect(block.functionInfo).toEqual(functionInfo);
    expect(block.isAsync).toBe(false);
    expect(block.index).toBe(0);
    expect(block.returnVariable).toBeDefined();
    expect(block.returnVariable?.name).toBe("testfunction");
    expect(block.returnVariable?.type).toBe("string");

    expect(state.blocks).toHaveLength(1);
    expect(state.blocks[0]).toBe(block);
    expect(state.variables).toHaveLength(1);
    expect(state.variables[0]).toEqual(block.returnVariable);
  });

  test("generates function call block with parameters based on state variables", () => {
    const stateWithVariables: CodeGeneratorState = {
      ...initialState,
      variables: [
        { name: "existingNumber", type: "number", index: 0 },
        { name: "existingBoolean", type: "boolean", index: 1 },
      ],
    };

    const { block, state } = createFunctionCallBlock(
      functionInfo,
      stateWithVariables
    );

    expect(block.parameters).toEqual(functionInfo.parameters);
    expect(state.variables).toHaveLength(3); // 2 existing + 1 new
    expect(state.variables[2]).toEqual(block.returnVariable);
  });

  test("generates async function call block for Promise return type", () => {
    const asyncFunctionInfo: FunctionInfo = {
      ...functionInfo,
      returnType: "Promise<string>",
    };

    const { block, state } = createFunctionCallBlock(
      asyncFunctionInfo,
      initialState
    );

    expect(block.isAsync).toBe(true);
    expect(block.returnVariable?.type).toBe("string");
    expect(state.isAsync).toBe(true);
  });

  test("generates unique variable names", () => {
    const stateWithExistingVariable: CodeGeneratorState = {
      ...initialState,
      variables: [{ name: "testfunction", type: "string", index: 0 }],
    };

    const { block, state } = createFunctionCallBlock(
      functionInfo,
      stateWithExistingVariable
    );

    expect(block.returnVariable?.name).toBe("testfunction2");
    expect(state.variables).toHaveLength(2);
    expect(state.variables[1]?.name).toBe("testfunction2");
  });

  test("creates multiple function call blocks and updates state correctly", () => {
    let currentState = initialState;

    const { block: block1, state: state1 } = createFunctionCallBlock(
      functionInfo,
      currentState
    );
    currentState = state1;

    const { block: block2, state: finalState } = createFunctionCallBlock(
      functionInfo,
      currentState
    );

    expect(block1.index).toBe(0);
    expect(block2.index).toBe(1);
    expect(finalState.blocks).toHaveLength(2);
    expect(finalState.blocks[0]).toBe(block1);
    expect(finalState.blocks[1]).toBe(block2);
    expect(finalState.variables).toHaveLength(2);
    expect(finalState.variables[0]).toEqual(block1.returnVariable);
    expect(finalState.variables[1]).toEqual(block2.returnVariable);
  });
});
