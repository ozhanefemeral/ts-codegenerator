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

    // Create a shared state object
    const state: CodeGeneratorState = {
      blocks: [],
      variables: [{ name: "counter", type: "number", index: 0 }],
      isAsync: false,
    };

    // Create blocks
    const blocks: CodeBlock[] = [
      createWhileBlock(
        "counter < 10",
        [
          createFunctionCallBlock(updateCounterInfo, state),
          createFunctionCallBlock(checkConditionInfo, state),
          createIfBlock(
            "checkcondition",
            [createFunctionCallBlock(processEvenInfo, state)],
            state,
            undefined,
            {
              blocks: [createFunctionCallBlock(processOddInfo, state)],
            }
          ),
        ],
        state
      ),
    ];

    // Generate code
    const generatedCode = generateCode(blocks);

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
