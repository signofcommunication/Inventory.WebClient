import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Item, ItemForm } from './types';

export const useItemsStore = defineStore('items', () => {
  // Mock data
  const items = ref<Item[]>([
    {
      id: 1,
      name: 'Laptop Dell',
      description: 'Dell Inspiron 15',
      categoryId: 1,
      quantity: 10,
      price: 15000000,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Mouse Logitech',
      description: 'Wireless mouse',
      categoryId: 2,
      quantity: 50,
      price: 150000,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ]);

  // Getters
  const getItems = computed(() => items.value);
  const getItemById = (id: number) => items.value.find((item) => item.id === id);

  // Actions
  const addItem = (itemForm: ItemForm) => {
    const newId = Math.max(...items.value.map((i) => i.id), 0) + 1;
    const now = new Date().toISOString();
    const newItem: Item = {
      id: newId,
      ...itemForm,
      createdAt: now,
      updatedAt: now,
    };
    items.value.push(newItem);
  };

  const updateItem = (id: number, itemForm: ItemForm) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      const existing = items.value[index];
      items.value[index] = {
        ...existing,
        ...itemForm,
        updatedAt: now,
      } as Item;
    }
  };

  const deleteItem = (id: number) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  return {
    items: getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
  };
});
