import { parsePrismaSchema } from "../prisma-parser";
import { mockSchemaString } from "./prisma-mock-schema";

describe("prisma schema parser", () => {
  const schema = parsePrismaSchema(mockSchemaString);

  describe("basic parsing", () => {
    test("parses all models", () => {
      const modelNames = schema.models.map((m) => m.name).sort();
      expect(modelNames).toEqual(
        [
          "Category",
          "Comment",
          "Company",
          "Employee",
          "Order",
          "OrderItem",
          "Post",
          "PostTag",
          "Profile",
          "Tag",
          "User",
        ].sort()
      );
    });

    test("parses enums", () => {
      expect(schema.enums).toHaveLength(1);
      expect(schema.enums[0]).toEqual({
        name: "Status",
        values: ["ACTIVE", "INACTIVE", "PENDING"],
      });
    });
  });

  describe("field parsing", () => {
    test("parses basic fields correctly", () => {
      const user = schema.models.find((m) => m.name === "User");
      expect(user?.fields).toContainEqual({
        name: "email",
        type: "String",
        isOptional: false,
        isList: false,
        attributes: [{ name: "unique", args: {} }],
      });
    });

    test("parses optional fields", () => {
      const post = schema.models.find((m) => m.name === "Post");
      expect(post?.fields).toContainEqual({
        name: "content",
        type: "String",
        isOptional: true,
        isList: false,
        attributes: [],
      });
    });

    test("parses array fields", () => {
      const user = schema.models.find((m) => m.name === "User");
      const postsField = user?.fields.find((f) => f.name === "posts");
      expect(postsField?.isList).toBe(true);
      expect(postsField?.type).toBe("Post");
    });
  });

  describe("attribute parsing", () => {
    test("parses @id attribute", () => {
      const post = schema.models.find((m) => m.name === "Post");
      const idField = post?.fields.find((f) => f.name === "id");
      expect(idField?.attributes).toContainEqual({
        name: "id",
        args: {},
      });
    });

    test("parses @default attribute with values", () => {
      const user = schema.models.find((m) => m.name === "User");
      const statusField = user?.fields.find((f) => f.name === "status");
      expect(statusField?.attributes).toContainEqual({
        name: "default",
        args: { value: "ACTIVE" },
      });
    });

    test("parses complex relation attributes", () => {
      const profile = schema.models.find((m) => m.name === "Profile");
      const userField = profile?.fields.find((f) => f.name === "user");
      expect(userField?.attributes).toContainEqual({
        name: "relation",
        args: {
          fields: ["userId"],
          references: ["id"],
        },
      });
    });
  });

  describe("relation parsing", () => {
    test("identifies one-to-many relations", () => {
      const userPostRelation = schema.relations.find(
        (r) => r.from.model === "User" && r.to.model === "Post"
      );
      expect(userPostRelation?.type).toBe("ONE_TO_MANY");
    });

    test("identifies many-to-one relations", () => {
      const postUserRelation = schema.relations.find(
        (r) => r.from.model === "Post" && r.to.model === "User"
      );
      expect(postUserRelation?.type).toBe("MANY_TO_ONE");
    });

    test("identifies one-to-one relations", () => {
      const userProfileRelation = schema.relations.find(
        (r) => r.from.model === "User" && r.to.model === "Profile"
      );
      expect(userProfileRelation?.type).toBe("ONE_TO_ONE");
    });
  });

  describe("error handling", () => {
    test("throws on invalid field syntax", () => {
      const invalidSchema = `
        model Invalid {
          badField
        }
      `;
      expect(() => parsePrismaSchema(invalidSchema)).toThrow();
    });

    test("throws on invalid model syntax", () => {
      const invalidSchema = `
        model {
          id Int
        }
      `;
      expect(() => parsePrismaSchema(invalidSchema)).toThrow();
    });
  });
});
