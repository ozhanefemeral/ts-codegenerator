import {
  PrismaSchema,
  PrismaModel,
  PrismaField,
  PrismaAttribute,
  PrismaRelation,
  PrismaEnum,
  RelationType,
} from "../types/prisma/prisma";

export class PrismaParser {
  private schema: string;

  constructor(schema: string) {
    this.schema = schema;
    this.parseModel = this.parseModel.bind(this);
    this.parseField = this.parseField.bind(this);
  }

  parse(): PrismaSchema {
    const modelStrings = this.extractModels();
    const models = modelStrings.map((str) => this.parseModel(str));
    const enums = this.parseEnums();
    const relations = this.buildRelations(models);

    return { models, enums, relations };
  }

  extractModels(): string[] {
    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
    const matches = [...this.schema.matchAll(modelRegex)];

    if (matches.length === 0) {
      throw new Error("no valid models found in schema");
    }

    matches.forEach((match) => {
      if (!match[1]) {
        throw new Error("invalid model definition: missing model name");
      }
    });

    return matches.map((match) => match[0]);
  }

  parseField(fieldLine: string): PrismaField {
    if (fieldLine.trim().startsWith("@@")) {
      return null as any;
    }

    const fieldRegex = /^\s*(\w+)\s+(\w+)(\[\])?\s*(\?)?\s*(.*)$/;
    const match = fieldLine.match(fieldRegex);

    if (!match) throw new Error(`invalid field: ${fieldLine}`);

    const [_, name, type, isList, isOptional, attributesStr] = match;

    if (!name || !type)
      throw new Error(`invalid field definition: ${fieldLine}`);

    const attributes = this.parseAttributes(attributesStr || "");

    return {
      name,
      type,
      attributes,
      isOptional: !!isOptional,
      isList: !!isList,
    };
  }

  parseAttributes(attributesStr: string): PrismaAttribute[] {
    const attrRegex = /@(\w+)(?:\((.*?)\))?/g;
    const attributes: PrismaAttribute[] = [];

    let match;
    while ((match = attrRegex.exec(attributesStr)) !== null) {
      const [_, name, args = ""] = match;
      if (!name) continue;

      attributes.push({
        name,
        args: this.parseAttributeArgs(args),
      });
    }

    return attributes;
  }

  parseAttributeArgs(argsStr: string): Record<string, any> {
    if (!argsStr.trim()) return {};

    if (!argsStr.includes(":")) {
      return { value: this.parseValue(argsStr) };
    }

    const args: Record<string, any> = {};
    const argsRegex = /(\w+):\s*([^,]+)/g;

    let match;
    while ((match = argsRegex.exec(argsStr)) !== null) {
      const [_, key, value] = match;
      if (!key || !value) {
        throw new Error("invalid attribute args");
      }
      args[key] = this.parseValue(value.trim());
    }

    return args;
  }

  parseValue(value: string): any {
    if (value.startsWith("[") && value.endsWith("]")) {
      return value
        .slice(1, -1)
        .split(",")
        .map((v) => this.parseValue(v.trim()));
    }
    if (value === "true") return true;
    if (value === "false") return false;
    if (/^\d+$/.test(value)) return parseInt(value);
    return value.replace(/['"]/g, "");
  }

  parseModel(modelStr: string): PrismaModel {
    const nameRegex = /model\s+(\w+)\s*{/;
    const match = modelStr.match(nameRegex);
    if (!match || !match[1]) {
      throw new Error(`invalid model definition: ${modelStr}`);
    }
    const name = match[1];

    const fieldLines = modelStr
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.includes("model") &&
          !line.includes("{") &&
          !line.includes("}")
      );

    const fields = fieldLines
      .map((line) => this.parseField(line.trim()))
      .filter((field): field is PrismaField => field !== null);
    const attributes: PrismaAttribute[] = [];

    return { name, fields, attributes };
  }

  parseEnums(): PrismaEnum[] {
    const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
    const enums: PrismaEnum[] = [];

    let match;
    while ((match = enumRegex.exec(this.schema)) !== null) {
      const [_, name, valuesStr] = match;
      if (!name || !valuesStr) continue;

      const values = valuesStr
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      enums.push({ name, values });
    }

    return enums;
  }

  buildRelations(models: PrismaModel[]): PrismaRelation[] {
    const relations: PrismaRelation[] = [];

    for (const model of models) {
      for (const field of model.fields) {
        if (!models.some((m) => m.name === field.type)) continue;

        const relationAttr = field.attributes.find(
          (attr) => attr.name === "relation"
        );

        const { fields = [], references = [] } = relationAttr?.args || {};
        const targetModel = field.type;

        relations.push({
          from: {
            model: model.name,
            fields,
          },
          to: {
            model: targetModel,
            fields: references,
          },
          type: this.determineRelationType(model.name, field),
        });
      }
    }

    return relations;
  }

  determineRelationType(modelName: string, field: PrismaField): RelationType {
    const isList = field.isList;

    // if this field is a list, it's a one-to-many from the current model
    if (isList) return "ONE_TO_MANY";

    // if this field has a relation attribute and isn't a list,
    // we need to check if it's referenced by a list in the target model
    const targetModel = this.findModelByName(field.type);
    if (!targetModel) return "ONE_TO_ONE";

    // check if the target model has a list field pointing back to this model
    const hasListReference = targetModel.fields.some(
      (f) => f.type === modelName && f.isList
    );

    // if the target has a list reference to us, this must be many-to-one
    return hasListReference ? "MANY_TO_ONE" : "ONE_TO_ONE";
  }

  findOppositeRelation(
    modelName: string,
    field: PrismaField
  ): PrismaField | undefined {
    const modelStrings = this.extractModels();
    const targetModel = modelStrings.find((m) =>
      m.includes(`model ${field.type}`)
    );

    if (!targetModel) return undefined;

    const fields = this.parseModel(targetModel).fields;
    return fields.find(
      (f) =>
        f.type === modelName &&
        f.attributes.some((attr) => attr.name === "relation")
    );
  }

  // helper method to find a model by name
  private findModelByName(name: string): PrismaModel | undefined {
    const modelStr = this.extractModels().find((str) =>
      str.includes(`model ${name}`)
    );
    return modelStr ? this.parseModel(modelStr) : undefined;
  }
}

export function parsePrismaSchema(schema: string): PrismaSchema {
  return new PrismaParser(schema).parse();
}
