<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Item Categories</div>

    <q-btn
      v-if="canCreate"
      label="Add Category"
      color="primary"
      @click="showForm = true"
      class="q-mb-md"
    />

    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Category List</div>
        <CategoryTable @edit="editCategory" />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showForm">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-if="editingCategory"
            v-model="form.code"
            label="Category Code"
            outlined
            :disable="true"
          />
          <q-input
            v-model="form.name"
            label="Category Name"
            outlined
            required
            :rules="[(val) => !!val || 'Category name is required']"
          />
          <q-input v-model="form.description" label="Description" outlined type="textarea" />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancel" @click="cancelForm" />
          <q-btn
            :label="editingCategory ? 'Update' : 'Save'"
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
import { useCategoriesStore } from './store';
import { hasRole } from '../../shared/permissions';
import type { Category } from './types';
import CategoryTable from './components/CategoryTable.vue';

const categoriesStore = useCategoriesStore();
const showForm = ref(false);
const editingCategory = ref<Category | null>(null);
const loading = computed(() => categoriesStore.loading);

const canCreate = computed(() => hasRole(['SUPERADMIN', 'ADMIN']));

const form = ref({
  code: '',
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
  form.value.code = category.code;
  form.value.name = category.name;
  form.value.description = category.description || '';
  showForm.value = true;
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
  form.value.code = '';
  form.value.name = '';
  form.value.description = '';
};
</script>
