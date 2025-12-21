export interface Loan {
  id: number;
  itemCode: string;
  itemName: string;
  borrower: string;
  quantity: number;
  loanDate: string;
  returnDate: string;
  status: 'active' | 'returned';
  note: string;
}

export interface LoanForm {
  itemCode: string;
  itemName: string;
  borrower: string;
  quantity: number;
  loanDate: string;
  returnDate: string;
  note: string;
}
