<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Data Barang</div>
    <div class="text-body1 q-mb-xl">Manage inventory items</div>

    <q-btn label="Tambah Barang" color="primary" @click="openAddDialog" class="q-mb-md" />

    <ItemTable
      :items="inventoryStore.items"
      :loading="inventoryStore.loading"
      @edit="openEditDialog"
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
            :loading="inventoryStore.loading"
            @submit="onSubmit"
            @cancel="closeDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useInventoryStore } from '../store';
import ItemTable from '../components/ItemTable.vue';
import ItemForm from '../components/ItemForm.vue';
import type { ItemForm as ItemFormData } from '../types';

const inventoryStore = useInventoryStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<ItemFormData>({
  code: '',
  name: '',
  description: '',
  category: '',
  quantity: 0,
  unit: '',
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.code = '';
  formData.name = '';
  formData.description = '';
  formData.category = '';
  formData.quantity = 0;
  formData.unit = '';
  dialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  isEdit.value = true;
  formData.code = item.code;
  formData.name = item.name;
  formData.description = item.description;
  formData.category = item.category;
  formData.quantity = item.quantity;
  formData.unit = item.unit;
  inventoryStore.selectItem(item);
  dialogOpen.value = true;
};

const onSubmit = (data: ItemFormData) => {
  if (isEdit.value && inventoryStore.selectedItem) {
    inventoryStore.updateItem(inventoryStore.selectedItem.id, data);
  } else {
    inventoryStore.createItem(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  inventoryStore.selectItem(null);
};
</script>
