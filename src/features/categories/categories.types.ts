export interface CategoryAttribute {
  attribute_id: string;
  code: string;
  name: string;
  data_type: string;
  options?: string[];
  is_required: boolean;
  default_value?: string;
  sort_order: number;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  attributes?: CategoryAttribute[];
  attribute_count?: number;
}

export interface CreateCategoryRequest {
  name: string;
  code: string;
}

export interface AddCategoryAttributeRequest {
  attribute_id: string;
  is_required: boolean;
  default_value?: string;
  sort_order?: number;
}
