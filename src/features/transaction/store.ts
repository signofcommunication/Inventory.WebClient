import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { StockOutItem, StockOutForm, StockInItem, StockInForm } from './types';

export const useTransactionStore = defineStore('transaction', () => {
  // Mock data
  const stockOutList = ref<StockOutItem[]>([
    {
      id: 1,
      itemCode: 'ITM001',
      itemName: 'Laptop Dell',
      quantity: 2,
      date: '2023-12-01',
      note: 'For office use',
    },
    {
      id: 2,
      itemCode: 'ITM002',
      itemName: 'Mouse Logitech',
      quantity: 5,
      date: '2023-12-02',
      note: 'Distributed to team',
    },
    {
      id: 3,
      itemCode: 'ITM003',
      itemName: 'Keyboard',
      quantity: 3,
      date: '2023-12-03',
      note: 'Replacement',
    },
  ]);

  const stockInList = ref<StockInItem[]>([
    {
      id: 1,
      itemCode: 'ITM001',
      itemName: 'Laptop Dell',
      quantity: 10,
      date: '2023-12-01',
      note: 'New stock',
      supplier: 'Supplier A',
    },
    {
      id: 2,
      itemCode: 'ITM002',
      itemName: 'Mouse Logitech',
      quantity: 20,
      date: '2023-12-02',
      note: 'Restock',
      supplier: 'Supplier B',
    },
  ]);

  const selectedItem = ref<StockOutItem | null>(null);
  const selectedInItem = ref<StockInItem | null>(null);
  const loading = ref(false);

  // Actions
  const fetchStockOut = () => {
    // Mock fetch - no API
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  };

  const createStockOut = (data: StockOutForm) => {
    const newId = Math.max(...stockOutList.value.map((item) => item.id), 0) + 1;
    const newItem: StockOutItem = {
      id: newId,
      ...data,
    };
    stockOutList.value.push(newItem);
  };

  const updateStockOut = (id: number, data: StockOutForm) => {
    const index = stockOutList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      stockOutList.value[index] = {
        id,
        ...data,
      };
    }
  };

  const selectItem = (item: StockOutItem | null) => {
    selectedItem.value = item;
  };

  // Stock In actions
  const fetchStockIn = () => {
    // Mock fetch - no API
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  };

  const createStockIn = (data: StockInForm) => {
    const newId = Math.max(...stockInList.value.map((item) => item.id), 0) + 1;
    const newItem: StockInItem = {
      id: newId,
      ...data,
    };
    stockInList.value.push(newItem);
  };

  const updateStockIn = (id: number, data: StockInForm) => {
    const index = stockInList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      stockInList.value[index] = {
        id,
        ...data,
      };
    }
  };

  const selectInItem = (item: StockInItem | null) => {
    selectedInItem.value = item;
  };

  return {
    stockOutList,
    stockInList,
    selectedItem,
    selectedInItem,
    loading,
    fetchStockOut,
    createStockOut,
    updateStockOut,
    selectItem,
    fetchStockIn,
    createStockIn,
    updateStockIn,
    selectInItem,
  };
});
