export type RelationType =
  | "ONE_TO_ONE"
  | "ONE_TO_MANY"
  | "MANY_TO_ONE"
  | "MANY_TO_MANY";

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

export interface PrismaField {
  name: string;
  type: string;
  attributes: PrismaAttribute[];
  isOptional: boolean;
  isList: boolean;
}

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

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
  attributes: PrismaAttribute[];
}

export interface PrismaEnum {
  name: string;
  values: string[];
}

export interface PrismaSchema {
  models: PrismaModel[];
  enums: PrismaEnum[];
  relations: PrismaRelation[];
}
