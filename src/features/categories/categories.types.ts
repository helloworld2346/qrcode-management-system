export interface CategoryAttribute {
  idCategoryAttribute: string;
  attributeId: string;
  code: string;
  attributeName: string;
  dataType: string;
  required: boolean;
  sortOrder: number;
  defaultValue: string;
}

export interface Category {
  idCategory: string;
  categoryName: string;
  description: string;
  attributes: CategoryAttribute[];
}

export interface CreateCategoryRequest {
  categoryName: string;
  description: string;
}

export interface AddCategoryAttributeRequest {
  category: string;
  attribute: string;
  required: boolean;
  sortOrder: number;
  defaultValue: string;
}
