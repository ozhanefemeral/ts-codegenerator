import { CodeBlock } from "../../types/blocks";
import { FunctionInfo } from "../../types/common";
import { CodeGeneratorState } from "../../types/generator";
import { createFunctionCallBlock } from "../blocks/function-call";
import { createIfBlock } from "../blocks/if-block";
import { createWhileBlock } from "../blocks/while-block";
import { generateCode } from "../code-generator";

describe("Code Generation", () => {
  test("generates correct code for while loop with nested if-block and function calls", () => {
    // Define function infos
    const updateCounterInfo: FunctionInfo = {
      name: "updateCounter",
      returnType: "number",
      parameters: [{ name: "counter", type: "number" }],
    };

    const checkConditionInfo: FunctionInfo = {
      name: "checkCondition",
      returnType: "boolean",
      parameters: [{ name: "counter", type: "number" }],
    };

    const processEvenInfo: FunctionInfo = {
      name: "processEven",
      returnType: "void",
      parameters: [{ name: "counter", type: "number" }],
    };

    const processOddInfo: FunctionInfo = {
      name: "processOdd",
      returnType: "void",
      parameters: [{ name: "counter", type: "number" }],
    };

    // Create initial state
    let state: CodeGeneratorState = {
      blocks: [],
      variables: [{ name: "counter", type: "number", index: 0 }],
      isAsync: false,
    };

    // Create blocks
    let whileLoopBlocks: CodeBlock[] = [];

    // Update counter
    const { block: updateCounterBlock, state: state1 } =
      createFunctionCallBlock(updateCounterInfo, state);
    whileLoopBlocks.push(updateCounterBlock);
    state = state1;

    // Check condition
    const { block: checkConditionBlock, state: state2 } =
      createFunctionCallBlock(checkConditionInfo, state);
    whileLoopBlocks.push(checkConditionBlock);
    state = state2;

    // Process even
    const { block: processEvenBlock, state: state3 } = createFunctionCallBlock(
      processEvenInfo,
      state
    );
    state = state3;

    // Process odd
    const { block: processOddBlock, state: state4 } = createFunctionCallBlock(
      processOddInfo,
      state
    );
    state = state4;

    // Create if block
    const { block: ifBlock, state: state5 } = createIfBlock(
      "checkcondition",
      [processEvenBlock],
      state,
      undefined,
      { blocks: [processOddBlock], blockType: "else" }
    );
    whileLoopBlocks.push(ifBlock);
    state = state5;

    // Create while block
    const { block: whileBlock } = createWhileBlock(
      "counter < 10",
      whileLoopBlocks,
      state
    );

    // Generate code
    const generatedCode = generateCode([whileBlock]);

    // Expected code (formatted for readability)
    const expectedCode = `
function generatedFunction() {
    while (counter < 10) {
        const updatecounter = updateCounter(counter);
        const checkcondition = checkCondition(counter);
        if (checkcondition) {
            const processeven = processEven(counter);
        }
        else {
            const processodd = processOdd(counter);
        }
    }
}
    `.trim();

    // Compare generated code with expected code
    expect(generatedCode.replace(/\s+/g, " ").trim()).toBe(
      expectedCode.replace(/\s+/g, " ").trim()
    );
  });
});
