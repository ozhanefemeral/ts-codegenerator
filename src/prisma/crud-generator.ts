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
    this.config = config;
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
    return `${model.name.toLowerCase()}.crud.ts`;
  }

  private generateModelOperations(model: PrismaModel): ModelOperation {
    const operations: ModelOperation = {};

    for (const op of this.config.operations) {
      operations[op] = this.generateOperation(model, op);
    }

    return operations;
  }

  private generateOperation(
    model: PrismaModel,
    operation: CrudOperation
  ): string {
    const modelName = model.name;
    const varName = modelName.toLowerCase();

    switch (operation) {
      case "create":
        return `
async function create${modelName}(data: Prisma.${modelName}CreateInput) {
  return prisma.${varName}.create({ data });
}`;

      case "read":
        return `
async function get${modelName}(id: string) {
  return prisma.${varName}.findUnique({ where: { id } });
}`;

      case "update":
        return `
async function update${modelName}(id: string, data: Prisma.${modelName}UpdateInput) {
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
  where?: Prisma.${modelName}WhereInput;
  orderBy?: Prisma.${modelName}OrderByWithRelationInput;
}) {
  return prisma.${varName}.findMany(params);
}`;

      default:
        throw new Error(`unsupported operation: ${operation}`);
    }
  }
}

export function generateCrud(
  schema: PrismaSchema,
  config: CrudConfig
): CrudOutput {
  return new CrudGenerator(schema, config).generate() as CrudOutput;
}
