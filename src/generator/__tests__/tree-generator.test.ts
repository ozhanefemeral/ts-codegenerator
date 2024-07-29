import {
  CodeBlock,
  FunctionCallBlock,
  IfBlock,
  WhileLoopBlock,
} from "../../types";
import {
  blockToTreeNode,
  blocksToTreeNodes,
  printNodes,
} from "../tree-generator";

describe("Tree Generation", () => {
  const functionCallBlock: FunctionCallBlock = {
    index: 0,
    blockType: "functionCall",
    functionInfo: { name: "testFunction", returnType: "void" },
    returnVariable: { name: "result", type: "void" },
    isAsync: false,
  };

  const whileLoopBlock: WhileLoopBlock = {
    index: 1,
    blockType: "while",
    condition: "x < 10",
    loopBlocks: [functionCallBlock],
  };

  const ifBlock: IfBlock = {
    index: 2,
    blockType: "if",
    condition: "y > 0",
    thenBlocks: [functionCallBlock],
    elseIfBlocks: [
      {
        condition: "y < 0",
        blocks: [whileLoopBlock],
        blockType: "else-if",
      },
    ],
    elseBlock: {
      blocks: [functionCallBlock],
      blockType: "else",
    },
  };

  describe("blockToTreeNode", () => {
    it("should convert a function call block to a non-nestable node", () => {
      const result = blockToTreeNode(functionCallBlock);
      expect(result.isNestable).toBe(false);
      expect(result.block).toBe(functionCallBlock);
      expect(result.children).toHaveLength(0);
      expect(result.hierarchy).toBe(0);
    });

    it("should convert a while loop block to a nestable node", () => {
      const result = blockToTreeNode(whileLoopBlock);
      expect(result.isNestable).toBe(true);
      expect(result.block).toBe(whileLoopBlock);
      expect(result.children).toHaveLength(1);
      expect(result.hierarchy).toBe(0);
      expect(result.children[0]?.block).toBe(functionCallBlock);
    });

    it("should convert an if block to a nestable node with correct structure", () => {
      const result = blockToTreeNode(ifBlock);
      expect(result.isNestable).toBe(true);
      expect(result.block).toBe(ifBlock);
      expect(result.children).toHaveLength(3); // then, else-if, else
      expect(result.hierarchy).toBe(0);

      // Check then block
      expect(result.children[0]?.block).toBe(functionCallBlock);

      // Check else-if block
      expect(result.children[1]?.block).toBe(ifBlock.elseIfBlocks![0]);
      expect(result.children[1]?.children[0]?.block).toBe(whileLoopBlock);

      // Check else block
      expect(result.children[2]?.block).toBe(ifBlock.elseBlock);
      expect(result.children[2]?.children[0]?.block).toBe(functionCallBlock);
    });
  });

  describe("blocksToTreeNodes", () => {
    it("should convert an array of blocks to tree nodes", () => {
      const blocks: CodeBlock[] = [functionCallBlock, whileLoopBlock, ifBlock];
      const result = blocksToTreeNodes(blocks);

      expect(result).toHaveLength(3);
      expect(result[0]?.block).toBe(functionCallBlock);
      expect(result[1]?.block).toBe(whileLoopBlock);
      expect(result[2]?.block).toBe(ifBlock);
    });

    it("should handle nested blocks correctly", () => {
      const nestedIfBlock: IfBlock = {
        ...ifBlock,
        thenBlocks: [whileLoopBlock],
      };
      const blocks: CodeBlock[] = [nestedIfBlock];
      const result = blocksToTreeNodes(blocks);

      expect(result).toHaveLength(1);
      expect(result[0]?.block).toBe(nestedIfBlock);
      expect(result[0]?.children).toHaveLength(3);
      expect(result[0]?.children[0]?.block).toBe(whileLoopBlock);
      expect(result[0]?.children[0]?.children[0]?.block).toBe(
        functionCallBlock
      );
    });

    it("should handle empty array", () => {
      const result = blocksToTreeNodes([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("Tree Printing", () => {
    it("should print the tree structure correctly", () => {
      const blocks: CodeBlock[] = [ifBlock, whileLoopBlock];
      const treeNodes = blocksToTreeNodes(blocks);

      const consoleLogSpy = jest.spyOn(console, "log");

      printNodes(treeNodes);

      expect(consoleLogSpy).toHaveBeenCalledWith("Tree 1:");
      expect(consoleLogSpy).toHaveBeenCalledWith("└── if");
      expect(consoleLogSpy).toHaveBeenCalledWith("    ├── functionCall");
      consoleLogSpy.mockRestore();
    });
  });
});
