import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../boot/axios';
import type { Loan, LoanForm } from './types';

interface Item {
  id: number;
  name: string;
}

export const useLoanStore = defineStore('loan', () => {
  const loans = ref<Loan[]>([]);
  const items = ref<Item[]>([]);
  const loading = ref(false);

  const fetchLoans = async () => {
    loading.value = true;
    try {
      const response = await api.get('/loans');
      loans.value = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching loans:', error);
      loans.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      items.value = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching items:', error);
      items.value = [];
    }
  };

  const createLoan = async (payload: LoanForm) => {
    loading.value = true;
    try {
      await api.post('/loans', payload);
      await fetchLoans(); // Auto refresh
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteLoan = async (id: number) => {
    loading.value = true;
    try {
      await api.delete(`/loans/${id}`);
      await fetchLoans(); // Auto refresh
    } catch (error) {
      console.error('Error deleting loan:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loans,
    items,
    loading,
    fetchLoans,
    fetchItems,
    createLoan,
    deleteLoan,
  };
});
