<template>
  <q-page>
    <div class="q-pa-md">
      <h5>Item Loan Approval</h5>
      <q-table
        :rows="loanStore.pendingLoans"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="No pending loans"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.value)" :label="props.value" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="positive"
              label="Approve"
              size="sm"
              @click="confirmApprove(props.row)"
              :loading="loading"
            />
            <q-btn
              color="negative"
              label="Reject"
              size="sm"
              @click="confirmReject(props.row)"
              :loading="loading"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-startDate="props">
          <q-td :props="props">
            {{ formatDate(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-endDate="props">
          <q-td :props="props">
            {{ formatDate(props.value) }}
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog Approve -->
    <q-dialog v-model="approveDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to approve this loan?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Approve" color="positive" @click="doApprove" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Reject -->
    <q-dialog v-model="rejectDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Reject Loan</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="rejectionReason" label="Rejection Reason" type="textarea" rows="3" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Reject" color="negative" @click="doReject" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoanStore } from './store';
import { Notify } from 'quasar';
import type { Loan } from './types';
import { useItemsStore } from '../inventory/store';

const loanStore = useLoanStore();
const { loading, fetchPendingLoans, approveLoan, rejectLoan } = loanStore;

const itemStore = useItemsStore();

const columns = [
  { name: 'borrowerName', label: 'Borrower', field: 'borrowerName', align: 'left' as const },
  { name: 'itemName', label: 'Item', field: 'itemName', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'left' as const },
  { name: 'startDate', label: 'Start Date', field: 'startDate', align: 'left' as const },
  { name: 'endDate', label: 'End Date', field: 'endDate', align: 'left' as const },
  { name: 'purpose', label: 'Purpose', field: 'purpose', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'left' as const },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'orange';
    case 'APPROVED':
      return 'green';
    case 'REJECTED':
      return 'red';
    default:
      return 'grey';
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID');
};

const approveDialog = ref(false);
const rejectDialog = ref(false);
const selectedLoan = ref<Loan | null>(null);
const rejectionReason = ref('');

const confirmApprove = (loan: Loan) => {
  selectedLoan.value = loan;
  approveDialog.value = true;
};

const doApprove = async () => {
  if (!selectedLoan.value) return;
  try {
    await approveLoan(selectedLoan.value.id);
    await itemStore.fetchItems(); // Refresh item quantities
    await fetchPendingLoans(); // Refresh pending loans list    Notify.create({ type: 'positive', message: 'Loan approved successfully' });
    approveDialog.value = false;
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to approve loan' });
  }
};

const confirmReject = (loan: Loan) => {
  selectedLoan.value = loan;
  rejectDialog.value = true;
};

const doReject = async () => {
  if (!selectedLoan.value) return;
  try {
    await rejectLoan(selectedLoan.value.id, rejectionReason.value);
    await fetchPendingLoans(); // Refresh pending loans list    Notify.create({ type: 'positive', message: 'Loan rejected successfully' });
    rejectDialog.value = false;
    rejectionReason.value = '';
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to reject loan' });
  }
};

onMounted(() => {
  console.log('LoanApprovalPage onMounted, calling fetchPendingLoans');
  void fetchPendingLoans();
});
</script>
