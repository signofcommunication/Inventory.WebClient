<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Peminjaman Barang</div>
    <div class="text-body1 q-mb-xl">Manage item loans</div>

    <q-btn label="Tambah Peminjaman" color="primary" @click="openAddDialog" class="q-mb-md" />

    <LoanTable
      :loans="loanStore.loans"
      :loading="loanStore.loading"
      @delete="onDelete"
      @return="onReturn"
    />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Loan</div>
        </q-card-section>
        <q-card-section>
          <LoanForm
            :model-value="formData"
            :items="loanStore.items"
            :loading="loanStore.loading"
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
import { useLoanStore } from './store';
import LoanTable from './components/LoanTable.vue';
import LoanForm from './components/LoanForm.vue';
import type { LoanForm as LoanFormData } from './types';
import { useItemStore } from '../inventory/store';

const loanStore = useLoanStore();
const itemStore = useItemStore();

const dialogOpen = ref(false);
const formData = reactive<LoanFormData>({
  itemId: 0,
  borrowerName: '',
  qty: 0,
  startDate: '',
  endDate: '',
  purpose: '',
});

onMounted(() => {
  loanStore.fetchLoans();
  loanStore.fetchItems();
});

const openAddDialog = () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day
  formData.itemId = 0;
  formData.borrowerName = '';
  formData.qty = 0;
  formData.startDate = now.toISOString().slice(0, 16); // For datetime-local
  formData.endDate = tomorrow.toISOString().slice(0, 16); // Default to tomorrow
  formData.purpose = '';
  loanStore.loading = false; // Reset loading
  dialogOpen.value = true;
};

const onSubmit = async (data: LoanFormData) => {
  if (data.itemId === 0 || !data.itemId) {
    Notify.create({ type: 'negative', message: 'Please select an item' });
    return;
  }
  const itemId = typeof data.itemId === 'object' ? (data.itemId as any).id : data.itemId;
  const payload = {
    itemId: itemId,
    qty: data.qty,
    borrowerName: data.borrowerName,
    startDate: data.startDate,
    endDate: data.endDate,
    purpose: data.purpose,
  };
  console.log('Payload:', payload); // Debug log
  try {
    await loanStore.createLoan(payload);
    Notify.create({ type: 'positive', message: 'Loan created successfully' });
    closeDialog();
  } catch (error) {
    console.error('Error in onSubmit:', error);
    Notify.create({ type: 'negative', message: 'Error saving loan' });
  }
};

const onDelete = async (loan: any) => {
  try {
    await loanStore.deleteLoan(loan.id);
    Notify.create({ type: 'positive', message: 'Loan deleted successfully' });
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error deleting loan' });
  }
};

const onReturn = async (loan: any) => {
  try {
    await loanStore.returnLoan(loan.id);
    await itemStore.fetchItems(); // Refresh item quantities
    Notify.create({ type: 'positive', message: 'Loan returned successfully' });
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error returning loan' });
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
};
</script>
