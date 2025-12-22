import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../boot/axios';
import { hasPermission } from '../../shared/permissions';
import type { Loan, LoanForm } from './types';

interface Item {
  id: number;
  name: string;
}

interface RawLoan {
  id: number;
  item?: { namaBarang: string };
  qty: number;
  borrowerName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: string;
  rejectionReason?: string;
  approvedBy?: { name: string };
}

interface RawItem {
  id: number;
  namaBarang?: string;
  name?: string;
}

export const useLoanStore = defineStore('loan', () => {
  const loans = ref<Loan[]>([]);
  const pendingLoans = ref<Loan[]>([]);
  const items = ref<Item[]>([]);
  const loading = ref(false);

  const fetchLoans = async () => {
    if (!hasPermission('loans.view')) {
      loans.value = [];
      return;
    }
    loading.value = true;
    try {
      const response = await api.get('/loans');
      loans.value = (Array.isArray(response.data) ? response.data : response.data.data || []).map(
        (loan: RawLoan) => ({
          id: loan.id,
          itemName: loan.item?.namaBarang || 'Unknown',
          quantity: loan.qty,
          borrowerName: loan.borrowerName,
          startDate: loan.startDate,
          endDate: loan.endDate,
          purpose: loan.purpose,
          status: loan.status,
          rejectionReason: loan.rejectionReason,
          approvedBy: loan.approvedBy?.name || null,
        }),
      );
    } catch (error) {
      console.error('Error fetching loans:', error);
      console.log('Error details:', (error as { response?: { data: unknown } }).response?.data);
      loans.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchPendingLoans = async () => {
    if (!hasPermission('loans.view')) {
      pendingLoans.value = [];
      return;
    }
    loading.value = true;
    try {
      console.log('Fetching pending loans...');
      const response = await api.get('/loans?status=PENDING');
      console.log('Pending loans response:', response.data);
      pendingLoans.value = (
        Array.isArray(response.data) ? response.data : response.data.data || []
      ).map((loan: RawLoan) => ({
        id: loan.id,
        itemName: loan.item?.namaBarang || 'Unknown',
        quantity: loan.qty,
        borrowerName: loan.borrowerName,
        startDate: loan.startDate,
        endDate: loan.endDate,
        purpose: loan.purpose,
        status: loan.status,
        rejectionReason: loan.rejectionReason,
        approvedBy: loan.approvedBy?.name || null,
      }));
    } catch (error) {
      console.error('Error fetching pending loans:', error);
      console.log('Error details:', (error as { response?: { data: unknown } }).response?.data);
      pendingLoans.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchItems = async () => {
    if (!hasPermission('items.view')) {
      items.value = [];
      return;
    }
    try {
      const response = await api.get('/items');
      console.log('Items response:', response.data); // Tambahkan log untuk debug
      items.value = Array.isArray(response.data.data)
        ? response.data.data.map((item: RawItem) => ({
            id: item.id,
            name: item.namaBarang || item.name || 'Unknown',
          }))
        : [];
    } catch (error) {
      console.error('Error fetching items:', error);
      items.value = [];
    }
  };

  const createLoan = async (payload: LoanForm) => {
    loading.value = true;
    try {
      console.log('Payload to backend:', payload); // Debug log
      await api.post('/loans', payload);
      await fetchLoans(); // Auto refresh
    } catch (error) {
      console.error('Error creating loan:', error);
      console.log(
        'Backend error response:',
        (error as { response?: { data: unknown } }).response?.data,
      ); // Debug log
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const approveLoan = async (loanId: number) => {
    loading.value = true;
    try {
      await api.put(`/loans/${loanId}/approve`);
      await fetchPendingLoans(); // Refresh pending loans
    } catch (error) {
      console.error('Error approving loan:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const rejectLoan = async (loanId: number, reason: string) => {
    loading.value = true;
    try {
      await api.put(`/loans/${loanId}/reject`, { reason });
      await fetchPendingLoans(); // Refresh pending loans
    } catch (error) {
      console.error('Error rejecting loan:', error);
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
    pendingLoans,
    items,
    loading,
    fetchLoans,
    fetchPendingLoans,
    fetchItems,
    createLoan,
    approveLoan,
    rejectLoan,
    deleteLoan,
  };
});
