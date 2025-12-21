export interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface ItemForm {
  name: string;
  stock: number;
}
