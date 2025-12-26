<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Data Barang</div>
    <div class="text-body1 q-mb-xl">Manage inventory items</div>

    <q-btn
      v-if="hasRole(['SUPERADMIN', 'ADMIN'])"
      label="Tambah Barang"
      color="primary"
      @click="openAddDialog"
      class="q-mb-md"
    />

    <ItemTable
      :items="itemStore.items"
      :loading="itemStore.loading"
      @edit="openEditDialog"
      @delete="onDelete"
    />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Item' : 'Add Item' }}</div>
        </q-card-section>
        <q-card-section>
          <ItemForm
            :model-value="formData"
            :is-edit="isEdit"
            :loading="itemStore.loading"
            @submit="onSubmit"
            @cancel="closeDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to delete this item?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useItemStore } from '../store';
import ItemTable from '../components/ItemTable.vue';
import ItemForm from '../components/ItemForm.vue';
import type { ItemForm as ItemFormData, Item } from '../types';
import { Notify } from 'quasar';
import { hasRole } from '../../../shared/permissions';
import { useCategoriesStore } from '../../categories/store';

const itemStore = useItemStore();
const categoriesStore = useCategoriesStore();

onMounted(() => {
  void itemStore.fetchItems();
  void categoriesStore.fetchCategories();
});

const dialogOpen = ref(false);
const isEdit = ref(false);
const showDeleteDialog = ref(false);
const selectedItemToDelete = ref<Item | null>(null);
const formData = reactive<ItemFormData>({
  kodeBarang: '',
  namaBarang: '',
  kategoriId: null,
  unit: '',
  fotoBarang: null,
});

const openAddDialog = () => {
  if (!hasRole(['SUPERADMIN', 'ADMIN'])) {
    Notify.create({ type: 'negative', message: 'Unauthorized' });
    return;
  }
  isEdit.value = false;
  formData.kodeBarang = '';
  formData.namaBarang = '';
  formData.kategoriId = null;
  formData.unit = '';
  formData.fotoBarang = null;
  dialogOpen.value = true;
};

const openEditDialog = (item: Item) => {
  if (!hasRole(['SUPERADMIN', 'ADMIN'])) {
    Notify.create({ type: 'negative', message: 'Unauthorized' });
    return;
  }
  isEdit.value = true;
  formData.kodeBarang = item.kodeBarang;
  formData.namaBarang = item.namaBarang;
  formData.kategoriId = item.kategoriId;
  formData.unit = item.unit;
  formData.fotoBarang = null; // For edit, don't set file, but preview will show existing
  itemStore.selectItem(item);
  dialogOpen.value = true;
};

const onSubmit = async (data: FormData) => {
  try {
    if (isEdit.value && itemStore.selectedItem) {
      await itemStore.updateItem(itemStore.selectedItem.id, data);
      Notify.create({ type: 'positive', message: 'Item updated successfully' });
    } else {
      await itemStore.createItem(data);
      Notify.create({ type: 'positive', message: 'Item created successfully' });
    }
    closeDialog();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    Notify.create({ type: 'negative', message: err.response?.data?.message || 'Error occurred' });
  }
};

const onDelete = (item: Item) => {
  if (!hasRole(['SUPERADMIN', 'ADMIN'])) {
    Notify.create({ type: 'negative', message: 'Unauthorized' });
    return;
  }
  selectedItemToDelete.value = item;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!selectedItemToDelete.value) return;
  try {
    await itemStore.deleteItem(selectedItemToDelete.value.id);
    Notify.create({ type: 'positive', message: 'Item deleted successfully' });
    showDeleteDialog.value = false;
    selectedItemToDelete.value = null;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    Notify.create({
      type: 'negative',
      message: err.response?.data?.message || 'Error occurred',
    });
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
  itemStore.selectItem(null);
};
</script>
