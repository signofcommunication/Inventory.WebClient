export interface Item {
  id: string;
  name: string;
  brandId: string;
  categoryId: number;
  itemCode: string;
  createdAt: string;
}

export interface ItemForm {
  name: string;
  brandId: string;
  categoryId: number;
}
