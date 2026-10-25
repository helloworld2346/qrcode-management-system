export type DataType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "DECIMAL"
  | "BOOLEAN"
  | "DATE"
  | "DATETIME"
  | "SELECT"
  | "MULTI_SELECT"
  | "CASCADE_SELECT";

export const DATA_TYPES: DataType[] = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "DECIMAL",
  "BOOLEAN",
  "DATE",
  "DATETIME",
  "SELECT",
  "MULTI_SELECT",
  "CASCADE_SELECT",
];

export const OPTION_TYPES: DataType[] = ["SELECT", "MULTI_SELECT"];

export type CascadeOptions = Record<string, string[]>;
export type AttributeOptions = string[] | CascadeOptions;

export interface CascadeValue {
  parent: string;
  child: string;
}

export interface Attribute {
  id: string;
  code: string;
  name: string;
  data_type: DataType;
  description?: string;
  validation_regex?: string;
  options?: AttributeOptions;
}

export interface CreateAttributeRequest {
  code: string;
  name: string;
  data_type: DataType;
  description?: string;
  validation_regex?: string;
  options?: AttributeOptions;
}
