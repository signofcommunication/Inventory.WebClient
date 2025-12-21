<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4>Categories</h4>
      <q-btn color="primary" icon="add" label="Add Category" @click="showAddDialog = true" />
    </div>

    <q-table :rows="categories" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" @click="editCategory(props.row)" />
          <q-btn flat round icon="delete" color="negative" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEdit ? 'Edit Category' : 'Add Category' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.name" label="Name" required outlined />
            <q-input v-model="form.description" label="Description" type="textarea" outlined />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                type="submit"
                :label="isEdit ? 'Update' : 'Add'"
                color="primary"
                :loading="submitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="2em" class="q-mr-md" />
          <span>Are you sure you want to delete this category?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QTableProps } from 'quasar';
import { useCategoriesStore } from 'src/features/categories/store';
import type { Category, CategoryForm } from 'src/features/categories/types';

const store = useCategoriesStore();

const categories = computed(() => store.categories);

const loading = ref(false);
const submitting = ref(false);
const showDialog = ref(false);
const showAddDialog = ref(false);
const showDeleteDialog = ref(false);
const isEdit = ref(false);
const currentCategory = ref<Category | null>(null);

const form = ref<CategoryForm>({
  name: '',
  description: '',
});

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'description', label: 'Description', field: 'description', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
  };
};

const editCategory = (category: Category) => {
  isEdit.value = true;
  currentCategory.value = category;
  form.value = {
    name: category.name,
    description: category.description,
  };
  showDialog.value = true;
};

const confirmDelete = (category: Category) => {
  currentCategory.value = category;
  showDeleteDialog.value = true;
};

const deleteConfirmed = () => {
  if (currentCategory.value) {
    store.deleteCategory(currentCategory.value.id);
    showDeleteDialog.value = false;
    currentCategory.value = null;
  }
};

const onSubmit = async () => {
  submitting.value = true;
  try {
    if (isEdit.value && currentCategory.value) {
      store.updateCategory(currentCategory.value.id, form.value);
    } else {
      store.addCategory(form.value);
    }
    showDialog.value = false;
    resetForm();
  } finally {
    submitting.value = false;
  }
};

// Watch for showAddDialog to open dialog
import { watch } from 'vue';
watch(showAddDialog, (newVal) => {
  if (newVal) {
    isEdit.value = false;
    resetForm();
    showDialog.value = true;
    showAddDialog.value = false;
  }
});
</script>
