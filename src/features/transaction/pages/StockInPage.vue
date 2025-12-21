<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Barang Masuk</div>
    <div class="text-body1 q-mb-xl">Record incoming goods</div>

    <q-btn label="Tambah Barang Masuk" color="primary" @click="openAddDialog" class="q-mb-md" />

    <StockInTable :stockIns="transactionStore.stockIns" :loading="transactionStore.loading" />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Stock In</div>
        </q-card-section>
        <q-card-section>
          <StockInForm
            :model-value="formData"
            :items="transactionStore.items"
            :suppliers="transactionStore.suppliers"
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
import { ref, reactive, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useTransactionStore } from '../store';
import StockInTable from '../components/StockInTable.vue';
import StockInForm from '../components/StockInForm.vue';
import type { StockInFormData } from '../types';

const transactionStore = useTransactionStore();

const dialogOpen = ref(false);
const formData = reactive<StockInFormData>({
  item: null,
  supplier: null,
  qty: 0,
});

onMounted(() => {
  transactionStore.fetchStockIn();
  transactionStore.fetchItems();
  transactionStore.fetchSuppliers();
});

const openAddDialog = () => {
  formData.item = null;
  formData.supplier = null;
  formData.qty = 0;
  dialogOpen.value = true;
};

const onSubmit = async (data: StockInFormData) => {
  try {
    const payload = {
      itemId: data.item?.id || 0,
      supplierId: data.supplier?.id || 0,
      qty: data.qty,
    };
    await transactionStore.createStockIn(payload);
    Notify.create({ type: 'positive', message: 'Stock In created successfully' });
    closeDialog();
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error creating stock in' });
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
};
</script>
