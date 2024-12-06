export type CrudOperation = "create" | "read" | "update" | "delete" | "list";

export type ModelOperation = {
  [key in CrudOperation]?: string;
};

export type CrudConfig = {
  operations: CrudOperation[];
  modelNames?: string[];
  outputDir?: string;
};

export type CrudOutput = {
  [fileName: string]: ModelOperation;
};
