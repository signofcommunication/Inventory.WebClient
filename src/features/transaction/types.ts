export interface StockOut {
  id: number;
  itemId: number;
  quantity: number;
  borrower: string;
  date: string;
}

export interface StockOutForm {
  itemId: number;
  quantity: number;
  borrower: string;
}

export interface StockIn {
  id: number;
  itemId: number;
  supplierId: number;
  qty: number;
  date: string;
}

export interface StockInForm {
  itemId: number;
  supplierId: number;
  qty: number;
}

interface Item {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export interface StockInFormData {
  item: Item | null;
  supplier: Supplier | null;
  qty: number;
}

export interface StockOutFormData {
  item: Item | null;
  qty: number;
  borrower: string;
}
