<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Peminjaman Barang</div>
    <div class="text-body1 q-mb-xl">Manage item loans</div>

    <q-btn label="Tambah Peminjaman" color="primary" @click="openAddDialog" class="q-mb-md" />

    <LoanTable :loans="loanStore.loans" :loading="loanStore.loading" @edit="openEditDialog" />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Loan' : 'Add Loan' }}</div>
        </q-card-section>
        <q-card-section>
          <LoanForm
            :model-value="formData"
            :is-edit="isEdit"
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
import { ref, reactive } from 'vue';
import { useLoanStore } from './store';
import LoanTable from './components/LoanTable.vue';
import LoanForm from './components/LoanForm.vue';
import type { LoanForm as LoanFormData } from './types';

const loanStore = useLoanStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<LoanFormData>({
  itemCode: '',
  itemName: '',
  borrower: '',
  quantity: 0,
  loanDate: '',
  returnDate: '',
  note: '',
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.itemCode = '';
  formData.itemName = '';
  formData.borrower = '';
  formData.quantity = 0;
  formData.loanDate = '';
  formData.returnDate = '';
  formData.note = '';
  dialogOpen.value = true;
};

const openEditDialog = (loan: any) => {
  isEdit.value = true;
  formData.itemCode = loan.itemCode;
  formData.itemName = loan.itemName;
  formData.borrower = loan.borrower;
  formData.quantity = loan.quantity;
  formData.loanDate = loan.loanDate;
  formData.returnDate = loan.returnDate;
  formData.note = loan.note;
  loanStore.selectLoan(loan);
  dialogOpen.value = true;
};

const onSubmit = (data: LoanFormData) => {
  if (isEdit.value && loanStore.selectedLoan) {
    loanStore.updateLoan(loanStore.selectedLoan.id, data);
  } else {
    loanStore.createLoan(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  loanStore.selectLoan(null);
};
</script>
