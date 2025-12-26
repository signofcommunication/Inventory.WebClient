import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import type { Category, CategoryForm } from './types';
import { Notify } from 'quasar';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const response = await api.get('/categories');
      categories.value = response.data.data || response.data;
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to fetch categories';
      Notify.create({
        type: 'negative',
        message,
      });
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (payload: CategoryForm) => {
    loading.value = true;
    try {
      const response = await api.post('/categories', payload);
      const newCategory = response.data.data || response.data;
      categories.value.push(newCategory);
      Notify.create({
        type: 'positive',
        message: 'Category created successfully',
      });
      return newCategory;
    } catch (error: unknown) {
      console.error('Error creating category:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to create category';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: number, payload: CategoryForm) => {
    loading.value = true;
    try {
      const response = await api.put(`/categories/${id}`, payload);
      const updatedCategory = response.data.data || response.data;
      const index = categories.value.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
      Notify.create({
        type: 'positive',
        message: 'Category updated successfully',
      });
      return updatedCategory;
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to update category';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: number) => {
    loading.value = true;
    try {
      await api.delete(`/categories/${id}`);
      categories.value = categories.value.filter((cat) => cat.id !== id);
      Notify.create({
        type: 'positive',
        message: 'Category deleted successfully',
      });
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to delete category';
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
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories: computed(() => categories.value),
    getCategoryById: (id: number) => categories.value.find((cat) => cat.id === id),
  };
});
