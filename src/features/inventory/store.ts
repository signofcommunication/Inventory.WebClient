import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Item, ItemForm } from './types';

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
        const res = await api.get('/items');
        console.log('API response:', res.data); // Debugging
        this.items = res.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createItem(payload: ItemForm) {
      console.log('Sending payload to API:', payload); // Debugging
      await api.post('/items', payload);
      await this.fetchItems();
    },

    async updateItem(id: number, payload: Partial<Item>) {
      await api.put(`/items/${id}`, payload);
      await this.fetchItems();
    },

    async deleteItem(id: number) {
      await api.delete(`/items/${id}`);
      await this.fetchItems();
    },

    selectItem(item: Item | null) {
      this.selectedItem = item;
    },
  },
});
