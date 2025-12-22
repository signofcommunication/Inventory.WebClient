<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4>Inventory Items</h4>
      <q-btn color="primary" icon="add" label="Add Item" @click="showAddDialog = true" />
    </div>

    <q-table :rows="items" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" @click="editItem(props.row)" />
          <q-btn flat round icon="delete" color="negative" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEdit ? 'Edit Item' : 'Add Item' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.name" label="Name" required outlined />
            <q-input v-model="form.description" label="Description" type="textarea" outlined />
            <q-select
              v-model="form.categoryId"
              :options="categoryOptions"
              label="Category"
              option-value="id"
              option-label="name"
              outlined
              required
              :loading="categoriesStore.loading"
              :disable="categoriesStore.loading"
            />
            <q-input
              v-model.number="form.quantity"
              label="Quantity"
              type="number"
              min="0"
              required
              outlined
            />
            <q-input
              v-model.number="form.price"
              label="Price"
              type="number"
              min="0"
              step="0.01"
              required
              outlined
            />
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
          <span>Are you sure you want to delete this item?</span>
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
import { ref, computed, onMounted } from 'vue';
import { useItemsStore } from 'src/features/items/store';
import { useCategoriesStore } from 'src/features/categories/store';
import type { Item, ItemForm } from 'src/features/items/types';
import type { QTableProps } from 'quasar';

const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();

const items = computed(() => itemsStore.items);
const categories = computed(() => categoriesStore.categories);

const loading = ref(false);
const submitting = ref(false);
const showDialog = ref(false);
const showAddDialog = ref(false);
const showDeleteDialog = ref(false);
const isEdit = ref(false);
const currentItem = ref<Item | null>(null);

const form = ref<ItemForm>({
  name: '',
  description: '',
  categoryId: 0,
  quantity: 0,
  price: 0,
});

const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ id: cat.id, name: cat.name })),
);

const columns: QTableProps['columns'] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'description', label: 'Description', field: 'description', align: 'left' as const },
  {
    name: 'category',
    label: 'Category',
    field: (row: Item) => categories.value.find((cat) => cat.id === row.categoryId)?.name || '',
    align: 'left' as const,
  },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  {
    name: 'price',
    label: 'Price',
    field: (row: Item) => `Rp ${row.price.toLocaleString()}`,
    align: 'right' as const,
  },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    categoryId: 0,
    quantity: 0,
    price: 0,
  };
};

const editItem = (item: Item) => {
  isEdit.value = true;
  currentItem.value = item;
  form.value = {
    name: item.name,
    description: item.description,
    categoryId: item.categoryId,
    quantity: item.quantity,
    price: item.price,
  };
  showDialog.value = true;
};

const confirmDelete = (item: Item) => {
  currentItem.value = item;
  showDeleteDialog.value = true;
};

const deleteConfirmed = () => {
  if (currentItem.value) {
    itemsStore.deleteItem(currentItem.value.id);
    showDeleteDialog.value = false;
    currentItem.value = null;
  }
};

const onSubmit = () => {
  submitting.value = true;
  try {
    if (isEdit.value && currentItem.value) {
      itemsStore.updateItem(currentItem.value.id, form.value);
    } else {
      itemsStore.addItem(form.value);
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

onMounted(() => {
  void categoriesStore.fetchCategories();
});
</script>
