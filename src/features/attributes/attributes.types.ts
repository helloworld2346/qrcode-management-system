export type DataType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "DECIMAL"
  | "BOOLEAN"
  | "DATE"
  | "DATETIME"
  | "SELECT"
  | "MULTI_SELECT";

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
];

export const OPTION_TYPES: DataType[] = ["SELECT", "MULTI_SELECT"];

export const REGEX_TYPES: DataType[] = [
  "NUMBER",
  "DECIMAL",
  "BOOLEAN",
  "DATE",
  "DATETIME",
];

export interface Attribute {
  idAttribute: string;
  code: string;
  attributeName: string;
  dataType: string;
  description: string;
  validationRegex: string | null;
  options: string | null;
}

export interface CreateAttributeRequest {
  code: string;
  attributeName: string;
  dataType: DataType;
  description: string;
  validationRegex: string | null;
  options: string | null;
}
