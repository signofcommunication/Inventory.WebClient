export interface Loan {
  id: number;
  itemId: number;
  borrower: string;
  quantity: number;
  returnDate: string;
}

export interface LoanForm {
  itemId: number;
  borrower: string;
  quantity: number;
  returnDate: string;
}
