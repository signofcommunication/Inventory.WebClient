export interface StockOutItem {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  date: string;
  note: string;
}

export interface StockOutForm {
  itemCode: string;
  itemName: string;
  quantity: number;
  date: string;
  note: string;
}

export interface StockInItem {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  date: string;
  note: string;
  supplier: string;
}

export interface StockInForm {
  itemCode: string;
  itemName: string;
  quantity: number;
  date: string;
  note: string;
  supplier: string;
}
