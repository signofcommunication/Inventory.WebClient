export interface ReportResponse<T> {
  data: T[] | { stockIns: T[]; stockOuts: T[] };
  generatedAt: string;
}

export interface TransactionItem {
  id: number;
  itemName: string;
  quantity: number;
  date: string;
  transactionType?: string; // Added for combined transactions
}

export interface SummaryReport {
  totalItems: number;
  totalSuppliers: number;
  totalStockIn: number;
  totalStockOut: number;
  totalLoans: number;
  totalUsers: number;
}
