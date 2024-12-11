/** Represents the type of relationship between models */
export type RelationType =
  | "ONE_TO_ONE"
  | "ONE_TO_MANY"
  | "MANY_TO_ONE"
  | "MANY_TO_MANY";

/** Represents a Prisma model attribute like @id, @unique, etc */
export interface PrismaAttribute {
  name: string;
  args: {
    fields?: string[];
    references?: string[];
    map?: string;
    default?: string | number | boolean;
    [key: string]: unknown;
  };
}

/** Represents a field in a Prisma model */
export interface PrismaField {
  name: string;
  type: string;
  attributes: PrismaAttribute[];
  isOptional: boolean;
  isList: boolean;
}

/** Represents a relationship between two Prisma models */
export interface PrismaRelation {
  from: {
    model: string;
    fields: string[];
  };
  to: {
    model: string;
    fields: string[];
  };
  type: RelationType;
}

/** Represents a Prisma model definition */
export interface PrismaModel {
  name: string;
  fields: PrismaField[];
  attributes: PrismaAttribute[];
}

/** Represents a Prisma enum definition */
export interface PrismaEnum {
  name: string;
  values: string[];
}

/** Represents a complete Prisma schema */
export interface PrismaSchema {
  models: PrismaModel[];
  enums: PrismaEnum[];
  relations: PrismaRelation[];
}
