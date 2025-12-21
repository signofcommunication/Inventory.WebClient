<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Barang Keluar</div>
    <div class="text-body1 q-mb-xl">Record outgoing goods</div>

    <q-btn label="Tambah Barang Keluar" color="primary" @click="openAddDialog" class="q-mb-md" />

    <StockOutTable
      :items="transactionStore.stockOutList"
      :loading="transactionStore.loading"
      @edit="openEditDialog"
    />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Stock Out' : 'Add Stock Out' }}</div>
        </q-card-section>
        <q-card-section>
          <StockOutForm
            :model-value="formData"
            :is-edit="isEdit"
            :loading="transactionStore.loading"
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
import { useTransactionStore } from '../store';
import StockOutTable from '../components/StockOutTable.vue';
import StockOutForm from '../components/StockOutForm.vue';
import type { StockOutForm as StockOutFormData } from '../types';

const transactionStore = useTransactionStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<StockOutFormData>({
  itemCode: '',
  itemName: '',
  quantity: 0,
  date: '',
  note: '',
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.itemCode = '';
  formData.itemName = '';
  formData.quantity = 0;
  formData.date = '';
  formData.note = '';
  dialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  isEdit.value = true;
  formData.itemCode = item.itemCode;
  formData.itemName = item.itemName;
  formData.quantity = item.quantity;
  formData.date = item.date;
  formData.note = item.note;
  transactionStore.selectItem(item);
  dialogOpen.value = true;
};

const onSubmit = (data: StockOutFormData) => {
  if (isEdit.value && transactionStore.selectedItem) {
    transactionStore.updateStockOut(transactionStore.selectedItem.id, data);
  } else {
    transactionStore.createStockOut(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  transactionStore.selectItem(null);
};
</script>
