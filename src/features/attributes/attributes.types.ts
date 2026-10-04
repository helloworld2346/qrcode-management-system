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

export const DEFAULT_VALIDATION_REGEX: Record<DataType, string | null> = {
  TEXT: null,
  TEXTAREA: null,
  NUMBER: "^-?\\d+$",
  DECIMAL: "^-?\\d+(\\.\\d+)?$",
  BOOLEAN: "^(true|false)$",
  DATE: "^\\d{4}-\\d{2}-\\d{2}$",
  DATETIME: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
  SELECT: null,
  MULTI_SELECT: null,
};

export function genAttributeCode(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return slug ? `${slug}_${suffix}` : `ATTR_${suffix}`;
}

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
