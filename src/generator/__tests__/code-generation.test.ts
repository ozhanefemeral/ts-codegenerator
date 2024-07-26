import { CodeBlock } from "../../types/blocks";
import { FunctionInfo } from "../../types/common";
import { createFunctionCallBlock } from "../blocks/function-call";
import { createIfBlock } from "../blocks/if-block";
import { generateCode } from "../code-generator";

describe("Code Generation", () => {
  test("generates correct code for function calls and if-block", () => {
    // Define function infos
    const func1Info: FunctionInfo = {
      name: "getGreeting",
      returnType: "string",
      parameters: [],
    };

    const func2Info: FunctionInfo = {
      name: "processGreeting",
      returnType: "void",
      parameters: [{ name: "greeting", type: "string" }],
    };

    const func3Info: FunctionInfo = {
      name: "handleTrueCondition",
      returnType: "void",
      parameters: [],
    };

    const func4Info: FunctionInfo = {
      name: "handleFalseCondition",
      returnType: "void",
      parameters: [],
    };

    // Create blocks
    const blocks: CodeBlock[] = [
      createFunctionCallBlock(func1Info, {
        blocks: [],
        variables: [],
        isAsync: false,
      }),
      createFunctionCallBlock(func2Info, {
        blocks: [],
        variables: [{ name: "greeting", type: "string", index: 0 }],
        isAsync: false,
      }),
      createIfBlock(
        "greeting.length > 0",
        [
          createFunctionCallBlock(func3Info, {
            blocks: [],
            variables: [],
            isAsync: false,
          }),
        ],
        { blocks: [], variables: [], isAsync: false },
        undefined,
        {
          blocks: [
            createFunctionCallBlock(func4Info, {
              blocks: [],
              variables: [],
              isAsync: false,
            }),
          ],
        }
      ),
    ];

    // Generate code
    const generatedCode = generateCode(blocks);

    // Expected code (formatted for readability)
    const expectedCode = `
function generatedFunction() {
    const getgreeting = getGreeting();
    const processgreeting = processGreeting(greeting);
    if (greeting.length > 0) {
        const handletruecondition = handleTrueCondition();
    }
    else {
        const handlefalsecondition = handleFalseCondition();
    }
}
    `.trim();

    // Compare generated code with expected code
    expect(generatedCode.replace(/\s+/g, " ").trim()).toBe(
      expectedCode.replace(/\s+/g, " ").trim()
    );
  });
});
