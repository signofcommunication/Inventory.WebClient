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
  code: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
}
