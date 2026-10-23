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

export interface Attribute {
  id: string;
  code: string;
  name: string;
  data_type: DataType;
  description?: string;
  validation_regex?: string;
  options?: string[]; // backend trả mảng JSON trực tiếp
}

export interface CreateAttributeRequest {
  code: string;
  name: string;
  data_type: DataType;
  description?: string;
  validation_regex?: string;
  options?: string[];
}
