export interface Item {
  id: string;
  name: string;
  brandId: string;
  categoryId: number;
  itemCode: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface ItemForm {
  name: string;
  brandId: string;
  categoryId: number;
  quantity: number;
  price: number;
}
