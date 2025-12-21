export interface Item {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemForm {
  name: string;
  description: string;
  categoryId: number;
  quantity: number;
  price: number;
}
