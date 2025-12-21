<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Barang Keluar</div>
    <div class="text-body1 q-mb-xl">Record outgoing goods</div>

    <q-btn label="Tambah Barang Keluar" color="primary" @click="openAddDialog" class="q-mb-md" />

    <StockOutTable :stockOuts="transactionStore.stockOuts" :loading="transactionStore.loading" />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Stock Out</div>
        </q-card-section>
        <q-card-section>
          <StockOutForm
            :model-value="formData"
            :items="transactionStore.items"
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
import StockOutTable from '../components/StockOutTable.vue';
import StockOutForm from '../components/StockOutForm.vue';
import type { StockOutFormData } from '../types';

const transactionStore = useTransactionStore();

const dialogOpen = ref(false);
const formData = reactive<StockOutFormData>({
  item: null,
  qty: 0,
  borrower: '',
});

onMounted(() => {
  transactionStore.fetchStockOut();
  transactionStore.fetchItems();
});

const openAddDialog = () => {
  formData.item = null;
  formData.qty = 0;
  formData.borrower = '';
  dialogOpen.value = true;
};

const onSubmit = async (data: StockOutFormData) => {
  try {
    const payload = {
      itemId: data.item?.id || 0,
      qty: data.qty,
      borrower: data.borrower,
    };
    await transactionStore.createStockOut(payload);
    Notify.create({ type: 'positive', message: 'Stock Out created successfully' });
    closeDialog();
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error creating stock out' });
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
};
</script>
