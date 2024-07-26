# ts-codegenerator

Write TypeScript code with one click!

[![npm version](https://badge.fury.io/js/%40ozhanefe%2Fts-codegenerator.svg)](https://badge.fury.io/js/%40ozhanefe%2Fts-codegenerator)

## Introduction

`ts-codegenerator` is a tool designed to simplify and accelerate TypeScript development. Since we developers often write similar patterns and structures, this package aims to automate these repetitive tasks, so we can focus on unique stuff. It is heavily used under [VisualTS monorepo](https://github.com/ozhanefemeral/visual-ts) to generate TypeScript/React (in the future) code.

## Key Concept: Blocks

At the core of `ts-codegenerator` is the concept of 'Blocks'. Blocks are reusable elements of TypeScript code - similar to how LEGO blocks can be combined to create complex structures. By assembling these Blocks, you can quickly generate complex TypeScript functions and modules.

## Why Use ts-codegenerator?

1. **Efficiency**: Automate repetitive coding patterns to save time and reduce errors.
2. **Cross-Platform**: Generate TypeScript code anytime, anywhere, on any device.
3. **Flexibility**: Easily adapt and modify generated code to suit specific needs. It can scan your codebase and generate code that fits your existing patterns.
4. **Visual Programming**: Using visual interfaces you connect the dots to better understand the code you are writing.

## Getting Started

1. Install the package:

   ```
   bun add @ozhanefe/ts-codegenerator
   ```

2. Import the necessary functions:

   ```typescript
   import {
     createFunctionCallBlock,
     generateCode,
   } from "@ozhanefe/ts-codegenerator";
   ```

3. Create code blocks:

   ```typescript
   const block1 = createFunctionCallBlock(
     {
       name: "fetchUser",
       returnType: "Promise<User>",
       parameters: [{ name: "id", type: "number" }],
     },
     state
   );

   const block2 = createFunctionCallBlock(
     {
       name: "processUser",
       returnType: "void",
       parameters: [{ name: "user", type: "User" }],
     },
     state
   );
   ```

4. Generate TypeScript code:

   ```typescript
   const code = generateCode([block1, block2]);
   console.log(code);
   ```

5. Output:
   ```typescript
   async function generatedFunction() {
     const user = await fetchUser(id);
     processUser(user);
   }
   ```

## Contributing

We welcome contributions to improve `ts-codegenerator`. If you've identified a bug, have a feature request, or want to contribute code, please open an issue or pull request on our GitHub repository.
