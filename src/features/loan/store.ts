import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Loan, LoanForm } from './types';

export const useLoanStore = defineStore('loan', () => {
  // Mock data
  const loans = ref<Loan[]>([
    {
      id: 1,
      itemCode: 'ITM001',
      itemName: 'Laptop Dell',
      borrower: 'John Doe',
      quantity: 1,
      loanDate: '2023-12-01',
      returnDate: '2023-12-10',
      status: 'active',
      note: 'For project work',
    },
    {
      id: 2,
      itemCode: 'ITM002',
      itemName: 'Mouse Logitech',
      borrower: 'Jane Smith',
      quantity: 2,
      loanDate: '2023-12-02',
      returnDate: '2023-12-05',
      status: 'returned',
      note: 'Temporary use',
    },
  ]);

  const selectedLoan = ref<Loan | null>(null);
  const loading = ref(false);

  // Actions
  const fetchLoans = () => {
    // Mock fetch - no API
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  };

  const createLoan = (data: LoanForm) => {
    const newId = Math.max(...loans.value.map((loan) => loan.id), 0) + 1;
    const newLoan: Loan = {
      id: newId,
      status: 'active',
      ...data,
    };
    loans.value.push(newLoan);
  };

  const updateLoan = (id: number, data: LoanForm) => {
    const index = loans.value.findIndex((loan) => loan.id === id);
    if (index !== -1) {
      loans.value[index] = {
        id,
        status: loans.value[index].status,
        ...data,
      };
    }
  };

  const selectLoan = (loan: Loan | null) => {
    selectedLoan.value = loan;
  };

  return {
    loans,
    selectedLoan,
    loading,
    fetchLoans,
    createLoan,
    updateLoan,
    selectLoan,
  };
});
