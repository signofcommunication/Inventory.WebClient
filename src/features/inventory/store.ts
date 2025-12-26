import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Item } from './types';
import { useCategoriesStore } from '../categories/store';

export const useItemStore = defineStore('item', {
  state: () => ({
    items: [] as Item[],
    selectedItem: null as Item | null,
    loading: false,
  }),

  actions: {
    async fetchItems() {
      this.loading = true;
      try {
        const res = await api.get('/items?include=kategori');
        console.log('API response:', res.data); // Debugging
        this.items = res.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createItem(payload: FormData) {
      console.log('Sending payload to API:', payload); // Debugging
      await api.post('/items', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.fetchItems();
    },

    async updateItem(id: number, payload: FormData) {
      await api.put(`/items/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.fetchItems();
    },

    async deleteItem(id: number) {
      await api.delete(`/items/${id}`);
      await this.fetchItems();
    },

    selectItem(item: Item | null) {
      this.selectedItem = item;
    },

    getCategories() {
      const categoriesStore = useCategoriesStore();
      return categoriesStore.getCategories;
    },
  },
});
