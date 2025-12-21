<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Kategori Barang</div>

    <q-btn
      v-if="canCreate"
      label="Tambah Kategori"
      color="primary"
      @click="showForm = true"
      class="q-mb-md"
    />

    <q-card>
      <q-card-section>
        <div class="text-h6">Daftar Kategori</div>
      </q-card-section>
      <q-card-section>
        <div v-if="loading">Loading...</div>
        <div v-else-if="categories.length === 0">Tidak ada kategori</div>
        <q-list v-else>
          <q-item v-for="category in categories" :key="category.id">
            <q-item-section>
              <q-item-label>{{ category.name }}</q-item-label>
              <q-item-label caption>{{ category.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="canEdit"
                icon="edit"
                size="sm"
                color="primary"
                flat
                round
                @click="editCategory(category)"
              />
              <q-btn
                v-if="canDelete"
                icon="delete"
                size="sm"
                color="negative"
                flat
                round
                @click="deleteCategory(category)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showForm">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="form.name"
            label="Nama Kategori"
            outlined
            required
            :rules="[(val) => !!val || 'Nama kategori wajib diisi']"
          />
          <q-input v-model="form.description" label="Deskripsi" outlined type="textarea" />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Batal" @click="cancelForm" />
          <q-btn
            :label="editingCategory ? 'Update' : 'Simpan'"
            color="primary"
            @click="saveForm"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCategoriesStore } from '../store';
import { hasRole } from '../../../shared/permissions';
import { Dialog } from 'quasar';
import type { Category } from '../types';

const categoriesStore = useCategoriesStore();
const showForm = ref(false);
const editingCategory = ref<Category | null>(null);
const loading = computed(() => categoriesStore.loading);
const categories = computed(() => categoriesStore.categories);

const canCreate = computed(() => hasRole(['SUPERADMIN', 'ADMIN']));
const canEdit = computed(() => hasRole(['SUPERADMIN', 'ADMIN']));
const canDelete = computed(() => hasRole(['SUPERADMIN']));

const form = ref({
  name: '',
  description: '',
});

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});

const editCategory = (category: Category) => {
  editingCategory.value = category;
  form.value.name = category.name;
  form.value.description = category.description || '';
  showForm.value = true;
};

const deleteCategory = async (category: Category) => {
  Dialog.create({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await categoriesStore.deleteCategory(category.id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  });
};

const saveForm = async () => {
  try {
    if (editingCategory.value) {
      await categoriesStore.updateCategory(editingCategory.value.id, form.value);
    } else {
      await categoriesStore.createCategory(form.value);
    }
    cancelForm();
  } catch (error) {
    console.error('Failed to save category:', error);
  }
};

const cancelForm = () => {
  showForm.value = false;
  editingCategory.value = null;
  form.value.name = '';
  form.value.description = '';
};
</script>
