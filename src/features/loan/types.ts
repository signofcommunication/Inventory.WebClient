export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface Loan {
  id: number;
  itemName: string;
  quantity: number;
  borrowerName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: LoanStatus;
  rejectionReason?: string;
  approvedBy?: string;
}

export interface LoanForm {
  itemId: number;
  borrowerName: string;
  qty: number;
  startDate: string;
  endDate: string;
  purpose: string;
}
