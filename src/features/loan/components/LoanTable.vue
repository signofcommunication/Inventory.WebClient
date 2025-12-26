<template>
  <q-table :rows="loans" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          v-if="props.row.status === 'APPROVED'"
          flat
          round
          icon="undo"
          color="positive"
          @click="returnLoan(props.row)"
        />
        <q-btn flat round icon="delete" color="negative" @click="deleteLoan(props.row)" />
      </q-td>
    </template>
    <template #body-cell-endDate="props">
      <q-td :props="props">
        {{ formatDate(props.value) }}
      </q-td>
    </template>
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge :color="getStatusColor(props.value)" :label="props.value" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { Loan } from '../types';

interface Props {
  loans: Loan[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  delete: [loan: Loan];
  return: [loan: Loan];
}>();

const columns = [
  { name: 'itemName', label: 'Item', field: 'itemName', align: 'left' as const },
  { name: 'borrowerName', label: 'Borrower', field: 'borrowerName', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'endDate', label: 'Return Date', field: 'endDate', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const deleteLoan = (loan: Loan) => {
  emit('delete', loan);
};

const returnLoan = (loan: Loan) => {
  emit('return', loan);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'REJECTED':
      return 'red';
    case 'RETURNED':
      return 'blue';
    default:
      return 'grey';
  }
};
</script>
