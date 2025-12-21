import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Category, CategoryForm } from './types';

export const useCategoriesStore = defineStore('categories', () => {
  // Mock data
  const categories = ref<Category[]>([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Accessories',
      description: 'Computer accessories',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ]);

  // Getters
  const getCategories = computed(() => categories.value);
  const getCategoryById = (id: number) => categories.value.find((cat) => cat.id === id);

  // Actions
  const addCategory = (categoryForm: CategoryForm) => {
    const newId = Math.max(...categories.value.map((c) => c.id), 0) + 1;
    const now = new Date().toISOString();
    const newCategory: Category = {
      id: newId,
      ...categoryForm,
      createdAt: now,
      updatedAt: now,
    };
    categories.value.push(newCategory);
  };

  const updateCategory = (id: number, categoryForm: CategoryForm) => {
    const index = categories.value.findIndex((cat) => cat.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      const existing = categories.value[index];
      categories.value[index] = {
        ...existing,
        ...categoryForm,
        updatedAt: now,
      } as Category;
    }
  };

  const deleteCategory = (id: number) => {
    const index = categories.value.findIndex((cat) => cat.id === id);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  };

  return {
    categories: getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
