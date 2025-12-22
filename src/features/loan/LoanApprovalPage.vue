<template>
  <q-page>
    <div class="q-pa-md">
      <h5>Persetujuan Peminjaman Barang</h5>
      <q-table
        :rows="pendingLoans"
        :columns="columns"
        row-key="id"
        :loading="loading"
        no-data-label="Tidak ada peminjaman pending"
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
              label="Setujui"
              size="sm"
              @click="confirmApprove(props.row)"
              :loading="loading"
            />
            <q-btn
              color="negative"
              label="Tolak"
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
          <span class="q-ml-sm">Apakah Anda yakin ingin menyetujui peminjaman ini?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn flat label="Setujui" color="positive" @click="doApprove" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Reject -->
    <q-dialog v-model="rejectDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Tolak Peminjaman</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="rejectionReason" label="Alasan Penolakan" type="textarea" rows="3" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn flat label="Tolak" color="negative" @click="doReject" :loading="loading" />
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

const loanStore = useLoanStore();
const { pendingLoans, loading, fetchPendingLoans, approveLoan, rejectLoan } = loanStore;

const columns = [
  { name: 'borrowerName', label: 'Peminjam', field: 'borrowerName', align: 'left' as 'left' },
  { name: 'itemName', label: 'Barang', field: 'itemName', align: 'left' as 'left' },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'left' as 'left' },
  { name: 'startDate', label: 'Tanggal Mulai', field: 'startDate', align: 'left' as 'left' },
  { name: 'endDate', label: 'Tanggal Selesai', field: 'endDate', align: 'left' as 'left' },
  { name: 'purpose', label: 'Keperluan', field: 'purpose', align: 'left' as 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as 'left' },
  { name: 'actions', label: 'Aksi', field: '', align: 'left' as 'left' },
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
    Notify.create({ type: 'positive', message: 'Peminjaman berhasil disetujui' });
    approveDialog.value = false;
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Gagal menyetujui peminjaman' });
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
    Notify.create({ type: 'positive', message: 'Peminjaman berhasil ditolak' });
    rejectDialog.value = false;
    rejectionReason.value = '';
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Gagal menolak peminjaman' });
  }
};

onMounted(() => {
  fetchPendingLoans();
});
</script>
