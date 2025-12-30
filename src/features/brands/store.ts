import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import type { Brand, BrandForm } from './types';
import { Notify } from 'quasar';

export const useBrandsStore = defineStore('brands', () => {
  const brands = ref<Brand[]>([]);
  const loading = ref(false);

  const fetchBrands = async () => {
    loading.value = true;
    try {
      const response = await api.get('/brands');
      brands.value = response.data.data || response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to fetch brands';
      Notify.create({
        type: 'negative',
        message,
      });
    } finally {
      loading.value = false;
    }
  };

  const createBrand = async (payload: BrandForm) => {
    loading.value = true;
    try {
      const response = await api.post('/brands', payload);
      const newBrand = response.data.data || response.data;
      brands.value.push(newBrand);
      Notify.create({
        type: 'positive',
        message: 'Brand created successfully',
      });
      return newBrand;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to create brand';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateBrand = async (id: string, payload: BrandForm) => {
    loading.value = true;
    try {
      const response = await api.put(`/brands/${id}`, payload);
      const updatedBrand = response.data.data || response.data;
      const index = brands.value.findIndex((brand) => brand.id === id);
      if (index !== -1) {
        brands.value[index] = updatedBrand;
      }
      Notify.create({
        type: 'positive',
        message: 'Brand updated successfully',
      });
      return updatedBrand;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to update brand';
      Notify.create({
        type: 'negative',
        message,
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteBrand = async (id: string) => {
    loading.value = true;
    try {
      await api.delete(`/brands/${id}`);
      brands.value = brands.value.filter((brand) => brand.id !== id);
      Notify.create({
        type: 'positive',
        message: 'Brand deleted successfully',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to delete brand';
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
    brands,
    loading,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    getBrands: computed(() => brands.value),
    getBrandById: (id: string) => brands.value.find((brand) => brand.id === id),
  };
});
