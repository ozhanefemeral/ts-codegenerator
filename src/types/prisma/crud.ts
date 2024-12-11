/** Available CRUD operations */
export type CrudOperation = "create" | "read" | "update" | "delete" | "list";

/** Maps operations to their implementation strings */
export type ModelOperation = {
  [key in CrudOperation]?: string;
};

/** Configuration for CRUD generation */
export type CrudConfig = {
  /** Operations to generate. Defaults to all operations if not specified */
  operations?: CrudOperation[];
  /** Specific models to generate CRUD for. Generates for all if not specified */
  modelNames?: string[];
  /** Output directory for generated files */
  outputDir?: string;
  /** Whether to prefix types with Prisma namespace. Defaults to true */
  usePrismaNamespace?: boolean;
};

/** Generated CRUD operations mapped by filename */
export type CrudOutput = {
  [fileName: string]: ModelOperation;
};
