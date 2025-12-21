<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Data Barang</div>
    <div class="text-body1 q-mb-xl">Manage inventory items</div>

    <q-btn label="Tambah Barang" color="primary" @click="openAddDialog" class="q-mb-md" />

    <ItemTable :items="itemStore.items" :loading="itemStore.loading" @edit="openEditDialog" />

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
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useItemStore } from '../store';
import ItemTable from '../components/ItemTable.vue';
import ItemForm from '../components/ItemForm.vue';
import type { ItemForm as ItemFormData } from '../types';

const itemStore = useItemStore();

onMounted(() => {
  itemStore.fetchItems();
});

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<ItemFormData>({
  name: '',
  stock: 0,
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.name = '';
  formData.stock = 0;
  dialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  isEdit.value = true;
  formData.name = item.name;
  formData.stock = item.quantity; // Map quantity to stock
  itemStore.selectItem(item);
  dialogOpen.value = true;
};

const onSubmit = (data: ItemFormData) => {
  if (isEdit.value && itemStore.selectedItem) {
    itemStore.updateItem(itemStore.selectedItem.id, {
      name: data.name,
      quantity: data.stock, // Map stock back to quantity for update
    });
  } else {
    itemStore.createItem(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  itemStore.selectItem(null);
};
</script>
