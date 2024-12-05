import { generateCrud } from "../crud-generator";
import { parsePrismaSchema } from "../prisma-parser";
import { mockSchemaString } from "./prisma-mock-schema";
import { CrudConfig } from "../../types/prisma/crud";

describe("crud generator", () => {
  const schema = parsePrismaSchema(mockSchemaString);

  describe("basic generation", () => {
    test("generates crud for all models when no modelNames specified", () => {
      const config: CrudConfig = {
        operations: ["create", "delete", "list", "read", "update"],
      };

      const output = generateCrud(schema, config);
      const fileNames = Object.keys(output);
      expect(fileNames).toHaveLength(11); // all models from mock schema

      const userCrud = output["user.crud.ts"];
      expect(userCrud).toBeDefined();
      expect(Object.keys(userCrud || {})).toHaveLength(5); // all operations
    });

    test("generates only specified operations", () => {
      const config: CrudConfig = {
        operations: ["create", "read"],
      };

      const output = generateCrud(schema, config);
      const userCrud = output["user.crud.ts"];

      expect(userCrud).toBeDefined();
      if (!userCrud) return;

      const operations = Object.keys(userCrud);
      expect(operations).toHaveLength(2);
      expect(userCrud.create).toBeDefined();
      expect(userCrud.read).toBeDefined();
      expect(userCrud.update).toBeUndefined();
    });
  });

  describe("model filtering", () => {
    test("generates crud only for specified models", () => {
      const config: CrudConfig = {
        operations: ["create", "read"],
        modelNames: ["User", "Post"],
      };

      const output = generateCrud(schema, config);
      expect(Object.keys(output)).toHaveLength(2);
      expect(output["user.crud.ts"]).toBeDefined();
      expect(output["post.crud.ts"]).toBeDefined();
      expect(output["profile.crud.ts"]).toBeUndefined();
    });
  });

  describe("operation content", () => {
    test("creates correct create operation", () => {
      const config: CrudConfig = {
        operations: ["create"],
        modelNames: ["User"],
      };

      const output = generateCrud(schema, config);
      const userCrud = output["user.crud.ts"];
      expect(userCrud).toBeDefined();
      if (!userCrud) return;

      expect(userCrud.create).toBeDefined();
      expect(userCrud.create).toContain("async function createUser");
      expect(userCrud.create).toContain("Prisma.UserCreateInput");
      expect(userCrud.create).toContain("prisma.user.create");
    });

    test("creates correct list operation with params", () => {
      const config: CrudConfig = {
        operations: ["list"],
        modelNames: ["Post"],
      };

      const output = generateCrud(schema, config);
      const postCrud = output["post.crud.ts"];
      expect(postCrud).toBeDefined();
      if (!postCrud) return;

      expect(postCrud.list).toContain("async function listPost");
      expect(postCrud.list).toContain("skip?: number");
      expect(postCrud.list).toContain("take?: number");
      expect(postCrud.list).toContain("Prisma.PostWhereInput");
      expect(postCrud.list).toContain("Prisma.PostOrderByWithRelationInput");
    });
  });

  describe("error handling", () => {
    test("throws on invalid operation type", () => {
      const config = {
        operations: ["create", "invalid"],
      } as CrudConfig;

      expect(() => generateCrud(schema, config)).toThrow();
    });

    test("throws on non-existent model", () => {
      const config: CrudConfig = {
        operations: ["create"],
        modelNames: ["NonExistentModel"],
      };

      const output = generateCrud(schema, config);
      expect(Object.keys(output)).toHaveLength(0);
    });
  });

  describe("file naming", () => {
    test("generates correct file names in lowercase", () => {
      const config: CrudConfig = {
        operations: ["create"],
        modelNames: ["User", "OrderItem"],
      };

      const output = generateCrud(schema, config);
      expect(output["user.crud.ts"]).toBeDefined();
      expect(output["orderitem.crud.ts"]).toBeDefined();
    });
  });
});
