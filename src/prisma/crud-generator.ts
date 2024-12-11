import { PrismaSchema, PrismaModel } from "../types/prisma/prisma";
import {
  CrudOperation,
  CrudConfig,
  CrudOutput,
  ModelOperation,
} from "../types/prisma/crud";

export class CrudGenerator {
  private schema: PrismaSchema;
  private config: CrudConfig;

  constructor(schema: PrismaSchema, config: CrudConfig) {
    this.schema = schema;
    this.config = {
      ...config,
      operations: config.operations || [
        "create",
        "read",
        "update",
        "delete",
        "list",
      ],
      usePrismaNamespace: config.usePrismaNamespace !== false,
    };
  }

  generate(): CrudOutput {
    const output: CrudOutput = {};
    const models = this.config.modelNames
      ? this.schema.models.filter((m) =>
          this.config.modelNames!.includes(m.name)
        )
      : this.schema.models;

    for (const model of models) {
      const fileName = this.getFileName(model);
      output[fileName] = this.generateModelOperations(model);
    }

    return output;
  }

  private getFileName(model: PrismaModel): string {
    return `${this.toCamelCase(model.name)}.crud.ts`;
  }

  private generateModelOperations(model: PrismaModel): ModelOperation {
    const operations: ModelOperation = {};

    for (const op of this.config.operations!) {
      operations[op] = this.generateOperation(model, op);
    }

    return operations;
  }

  private generateOperation(
    model: PrismaModel,
    operation: CrudOperation
  ): string {
    const modelName = model.name;
    const varName = this.toCamelCase(modelName);
    const typePrefix = this.config.usePrismaNamespace ? "Prisma." : "";

    switch (operation) {
      case "create":
        return `
async function create${modelName}(data: ${typePrefix}${modelName}CreateInput) {
  return prisma.${varName}.create({ data });
}`;

      case "read":
        return `
async function get${modelName}(id: string): Promise<${typePrefix}${modelName} | null> {
  return prisma.${varName}.findUnique({ where: { id } });
}`;

      case "update":
        return `
async function update${modelName}(id: string, data: ${typePrefix}${modelName}UpdateInput) {
  return prisma.${varName}.update({ where: { id }, data });
}`;

      case "delete":
        return `
async function delete${modelName}(id: string) {
  return prisma.${varName}.delete({ where: { id } });
}`;

      case "list":
        return `
async function list${modelName}(params?: { 
  skip?: number;
  take?: number;
  where?: ${typePrefix}${modelName}WhereInput;
  orderBy?: ${typePrefix}${modelName}OrderByWithRelationInput;
}): Promise<${typePrefix}${modelName}[]> {
  return prisma.${varName}.findMany(params);
}`;

      default:
        throw new Error(`unsupported operation: ${operation}`);
    }
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

export function generateCrud(
  schema: PrismaSchema,
  config: CrudConfig
): CrudOutput {
  return new CrudGenerator(schema, config).generate() as CrudOutput;
}
