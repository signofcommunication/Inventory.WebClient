<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Peminjaman Barang</div>
    <div class="text-body1 q-mb-xl">Manage item loans</div>

    <q-btn label="Tambah Peminjaman" color="primary" @click="openAddDialog" class="q-mb-md" />

    <LoanTable :loans="loanStore.loans" :loading="loanStore.loading" @delete="onDelete" />

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

const loanStore = useLoanStore();

const dialogOpen = ref(false);
const formData = reactive<LoanFormData>({
  itemId: 0,
  borrower: '',
  quantity: 0,
  returnDate: '',
});

onMounted(() => {
  loanStore.fetchLoans();
  loanStore.fetchItems();
});

const openAddDialog = () => {
  formData.itemId = 0;
  formData.borrower = '';
  formData.quantity = 0;
  formData.returnDate = '';
  dialogOpen.value = true;
};

const onSubmit = async (data: LoanFormData) => {
  try {
    await loanStore.createLoan(data);
    Notify.create({ type: 'positive', message: 'Loan created successfully' });
    closeDialog();
  } catch (error) {
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

const closeDialog = () => {
  dialogOpen.value = false;
};
</script>
