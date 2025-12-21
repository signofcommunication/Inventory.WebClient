import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../boot/axios';
import type { Supplier, SupplierForm } from './types';

export const useSupplierStore = defineStore('supplier', () => {
  const suppliers = ref<Supplier[]>([]);
  const selectedSupplier = ref<Supplier | null>(null);
  const loading = ref(false);

  const fetchSuppliers = async () => {
    loading.value = true;
    try {
      const response = await api.get('/suppliers');
      let data = response.data;
      if (!Array.isArray(data)) {
        data = data?.data || data?.suppliers || [];
      }
      suppliers.value = Array.isArray(data) ? data : [];
      console.log('Fetched suppliers:', suppliers.value);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      suppliers.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createSupplier = async (payload: SupplierForm) => {
    loading.value = true;
    try {
      await api.post('/suppliers', payload);
      await fetchSuppliers(); // Auto refresh
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateSupplier = async (id: number, payload: SupplierForm) => {
    loading.value = true;
    try {
      await api.put(`/suppliers/${id}`, payload);
      await fetchSuppliers(); // Auto refresh
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteSupplier = async (id: number) => {
    loading.value = true;
    try {
      await api.delete(`/suppliers/${id}`);
      await fetchSuppliers(); // Auto refresh
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    } finally {
      loading.value = false;
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
    deleteSupplier,
    selectSupplier,
  };
});
