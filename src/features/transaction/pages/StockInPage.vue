<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Barang Masuk</div>
    <div class="text-body1 q-mb-xl">Record incoming goods</div>

    <q-btn label="Tambah Barang Masuk" color="primary" @click="openAddDialog" class="q-mb-md" />

    <StockInTable
      :items="transactionStore.stockInList"
      :loading="transactionStore.loading"
      @edit="openEditDialog"
    />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Stock In' : 'Add Stock In' }}</div>
        </q-card-section>
        <q-card-section>
          <StockInForm
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
import StockInTable from '../components/StockInTable.vue';
import StockInForm from '../components/StockInForm.vue';
import type { StockInForm as StockInFormData } from '../types';

const transactionStore = useTransactionStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<StockInFormData>({
  itemCode: '',
  itemName: '',
  quantity: 0,
  date: '',
  note: '',
  supplier: '',
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.itemCode = '';
  formData.itemName = '';
  formData.quantity = 0;
  formData.date = '';
  formData.note = '';
  formData.supplier = '';
  dialogOpen.value = true;
};

const openEditDialog = (item: any) => {
  isEdit.value = true;
  formData.itemCode = item.itemCode;
  formData.itemName = item.itemName;
  formData.quantity = item.quantity;
  formData.date = item.date;
  formData.note = item.note;
  formData.supplier = item.supplier;
  transactionStore.selectInItem(item);
  dialogOpen.value = true;
};

const onSubmit = (data: StockInFormData) => {
  if (isEdit.value && transactionStore.selectedInItem) {
    transactionStore.updateStockIn(transactionStore.selectedInItem.id, data);
  } else {
    transactionStore.createStockIn(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  transactionStore.selectInItem(null);
};
</script>
