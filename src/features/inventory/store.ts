import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import type { Item, ItemForm } from './types';
import { Notify } from 'quasar';

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([]);
  const loading = ref(false);

  const fetchItems = async () => {
    loading.value = true;
    try {
      const response = await api.get('/items');
      items.value = response.data.data || response.data;
    } catch (error: unknown) {
      console.error('Error fetching items:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to fetch items';
      Notify.create({
        type: 'negative',
        message,
      });
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (payload: ItemForm | FormData) => {
    loading.value = true;
    try {
      const config =
        payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const response = await api.post('/items', payload, config);
      const newItem = response.data.data || response.data;
      items.value.push(newItem);
      Notify.create({
        type: 'positive',
        message: 'Item created successfully',
      });
      return newItem;
    } catch (error: unknown) {
      console.error('Error creating item:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to create item';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (id: string, payload: ItemForm) => {
    loading.value = true;
    try {
      const response = await api.put(`/items/${id}`, payload);
      const updatedItem = response.data.data || response.data;
      const index = items.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }
      Notify.create({
        type: 'positive',
        message: 'Item updated successfully',
      });
      return updatedItem;
    } catch (error: unknown) {
      console.error('Error updating item:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to update item';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    fetchItems,
    createItem,
    updateItem,
    getItems: computed(() => items.value),
    getItemById: (id: string) => items.value.find((item) => item.id === id),
  };
});
