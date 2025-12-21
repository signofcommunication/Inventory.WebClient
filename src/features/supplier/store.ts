import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Supplier, SupplierForm } from './types';

export const useSupplierStore = defineStore('supplier', () => {
  // Mock data
  const suppliers = ref<Supplier[]>([
    {
      id: 1,
      code: 'SUP001',
      name: 'Supplier A',
      contact: 'John Doe',
      address: '123 Main St',
      email: 'john@supplierA.com',
      phone: '123-456-7890',
    },
    {
      id: 2,
      code: 'SUP002',
      name: 'Supplier B',
      contact: 'Jane Smith',
      address: '456 Elm St',
      email: 'jane@supplierB.com',
      phone: '098-765-4321',
    },
  ]);

  const selectedSupplier = ref<Supplier | null>(null);
  const loading = ref(false);

  // Actions
  const fetchSuppliers = () => {
    // Mock fetch - no API
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  };

  const createSupplier = (data: SupplierForm) => {
    const newId = Math.max(...suppliers.value.map((supplier) => supplier.id), 0) + 1;
    const newSupplier: Supplier = {
      id: newId,
      ...data,
    };
    suppliers.value.push(newSupplier);
  };

  const updateSupplier = (id: number, data: SupplierForm) => {
    const index = suppliers.value.findIndex((supplier) => supplier.id === id);
    if (index !== -1) {
      suppliers.value[index] = {
        id,
        ...data,
      };
    }
  };

  const selectSupplier = (supplier: Supplier | null) => {
    selectedSupplier.value = supplier;
  };

  return {
    suppliers,
    selectedSupplier,
    loading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    selectSupplier,
  };
});
