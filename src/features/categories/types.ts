export interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface CategoryForm {
  code: string;
  name: string;
  description: string;
}
