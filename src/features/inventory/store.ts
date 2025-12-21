import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Item, ItemForm } from './types';

export const useInventoryStore = defineStore('inventory', () => {
  // Mock data
  const items = ref<Item[]>([
    {
      id: 1,
      code: 'ITM001',
      name: 'Laptop Dell',
      description: 'High-performance laptop',
      category: 'Electronics',
      quantity: 50,
      unit: 'pcs',
    },
    {
      id: 2,
      code: 'ITM002',
      name: 'Mouse Logitech',
      description: 'Wireless mouse',
      category: 'Accessories',
      quantity: 100,
      unit: 'pcs',
    },
    {
      id: 3,
      code: 'ITM003',
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      category: 'Accessories',
      quantity: 30,
      unit: 'pcs',
    },
  ]);

  const selectedItem = ref<Item | null>(null);
  const loading = ref(false);

  // Actions
  const fetchItems = () => {
    // Mock fetch - no API
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  };

  const createItem = (data: ItemForm) => {
    const newId = Math.max(...items.value.map((item) => item.id), 0) + 1;
    const newItem: Item = {
      id: newId,
      ...data,
    };
    items.value.push(newItem);
  };

  const updateItem = (id: number, data: ItemForm) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value[index] = {
        id,
        ...data,
      };
    }
  };

  const selectItem = (item: Item | null) => {
    selectedItem.value = item;
  };

  return {
    items,
    selectedItem,
    loading,
    fetchItems,
    createItem,
    updateItem,
    selectItem,
  };
});
