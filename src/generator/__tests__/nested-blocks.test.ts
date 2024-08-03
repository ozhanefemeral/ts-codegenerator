import { createFunctionCallBlock } from "generator/blocks/function-call";
import { createIfBlock } from "generator/blocks/if-block";
import { createWhileBlock } from "generator/blocks/while-block";
import { CodeGeneratorState } from "types/generator";

test("creates function call block inside if/else/else-if blocks", () => {
  let state: CodeGeneratorState = {
    blocks: [],
    variables: [],
    isAsync: false,
  };

  // Create an if block to nest our function calls in
  const { block: ifBlock, state: state1 } = createIfBlock(
    "x > 0",
    [],
    state,
    [
      {
        condition: "x < 0",
        blocks: [],
        blockType: "else-if",
        index: 1,
      },
    ],
    {
      blocks: [],
      blockType: "else",
      index: 2,
    }
  );
  state = state1;

  // Create function calls
  const { block: thenFuncBlock, state: state2 } = createFunctionCallBlock(
    { name: "thenFunc", returnType: "void" },
    state,
    ifBlock
  );
  state = state2;

  const { state: state3 } = createFunctionCallBlock(
    { name: "elseIfFunc", returnType: "void" },
    state,
    ifBlock.elseIfBlocks![0]
  );
  state = state3;

  const { state: state4 } = createFunctionCallBlock(
    { name: "elseFunc", returnType: "void" },
    state,
    ifBlock.elseBlock!
  );
  state = state4;

  // Assertions
  expect(state.blocks).toHaveLength(1);

  const mainBlock = state.blocks[0];
  expect(mainBlock?.blockType).toBe("if");

  if (mainBlock?.blockType !== "if") {
    throw new Error("Expected main block to be an if block");
  }

  expect(mainBlock).toEqual({
    condition: "x > 0",
    thenBlocks: [thenFuncBlock],
    elseIfBlocks: [
      {
        condition: "x < 0",
        blocks: [],
        blockType: "else-if",
        index: 1,
      },
    ],
    elseBlock: {
      blocks: [],
      blockType: "else",
      index: 2,
    },
    index: 0,
    blockType: "if",
  });

  // Check that the variables were added correctly
  expect(state.variables).toHaveLength(3);
  expect(state.variables.map((v) => v.name)).toEqual([
    "thenfunc",
    "elseiffunc",
    "elsefunc",
  ]);
});

test("creates function call block inside while block", () => {
  let state: CodeGeneratorState = {
    blocks: [],
    variables: [],
    isAsync: false,
  };

  // Create a while block to nest our function calls in
  const { block: whileBlock, state: state1 } = createWhileBlock(
    "x < 10",
    [],
    state
  );
  state = state1;

  // Create a function call inside the while block
  const { block: incrementFunc, state: state2 } = createFunctionCallBlock(
    { name: "incrementX", returnType: "number" },
    state,
    whileBlock
  );
  state = state2;

  // Create another function call inside the while block
  const { block: printFunc, state: state3 } = createFunctionCallBlock(
    { name: "printX", returnType: "void" },
    state,
    whileBlock
  );
  state = state3;

  // Assertions
  expect(state.blocks).toHaveLength(1);

  const mainBlock = state.blocks[0];
  expect(mainBlock?.blockType).toBe("while");

  if (mainBlock?.blockType !== "while") {
    throw new Error("Expected main block to be a while block");
  }

  expect(mainBlock).toEqual({
    condition: "x < 10",
    loopBlocks: [incrementFunc, printFunc],
    index: 0,
    blockType: "while",
  });

  // Check that the nested blocks are correct
  expect(mainBlock.loopBlocks).toHaveLength(2);
  expect(mainBlock.loopBlocks[0]).toBe(incrementFunc);
  expect(mainBlock.loopBlocks[1]).toBe(printFunc);

  // Check that the variables were added correctly
  expect(state.variables).toHaveLength(2);
  expect(state.variables.map((v) => v.name)).toEqual(["incrementx", "printx"]);

  // Check the structure of the nested function call blocks
  expect(incrementFunc).toEqual({
    functionInfo: { name: "incrementX", returnType: "number" },
    returnVariable: { name: "incrementx", type: "number", index: 1 },
    isAsync: false,
    index: 1,
    blockType: "functionCall",
    parameters: undefined,
  });

  expect(printFunc).toEqual({
    functionInfo: { name: "printX", returnType: "void" },
    returnVariable: { name: "printx", type: "void", index: 2 },
    isAsync: false,
    index: 2,
    blockType: "functionCall",
    parameters: undefined,
  });
});
