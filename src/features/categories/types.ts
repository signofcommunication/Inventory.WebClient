export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface CategoryForm {
  name: string;
  description: string;
}
