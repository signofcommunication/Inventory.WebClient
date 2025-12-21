import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../boot/axios';
import type { StockIn, StockOut } from './types';

interface Item {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export const useTransactionStore = defineStore('transaction', () => {
  const stockIns = ref<StockIn[]>([]);
  const stockOuts = ref<StockOut[]>([]);
  const items = ref<Item[]>([]);
  const suppliers = ref<Supplier[]>([]);
  const loading = ref(false);

  const fetchStockIn = async () => {
    loading.value = true;
    try {
      const response = await api.get('/stock-in');
      stockIns.value = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching stock in:', error);
      stockIns.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createStockIn = async (payload: { itemId: number; supplierId: number; qty: number }) => {
    loading.value = true;
    try {
      await api.post('/stock-in', payload);
      await fetchStockIn(); // Auto refresh
    } catch (error) {
      console.error('Error creating stock in:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchStockOut = async () => {
    loading.value = true;
    try {
      const response = await api.get('/stock-out');
      stockOuts.value = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching stock out:', error);
      stockOuts.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createStockOut = async (payload: { itemId: number; qty: number; borrower: string }) => {
    loading.value = true;
    try {
      await api.post('/stock-out', payload);
      await fetchStockOut(); // Auto refresh
    } catch (error) {
      console.error('Error creating stock out:', error);
      throw error;
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

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      suppliers.value = Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      suppliers.value = [];
    }
  };

  return {
    stockIns,
    stockOuts,
    items,
    suppliers,
    loading,
    fetchStockIn,
    createStockIn,
    fetchStockOut,
    createStockOut,
    fetchItems,
    fetchSuppliers,
  };
});
