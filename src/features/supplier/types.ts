export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
}

export interface SupplierForm {
  name: string;
  phone?: string;
  address?: string;
}
