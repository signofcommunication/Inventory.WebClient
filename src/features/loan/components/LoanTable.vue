<template>
  <q-table :rows="loans" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="edit" color="primary" @click="editLoan(props.row)" />
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
  edit: [loan: Loan];
}>();

const columns = [
  { name: 'itemCode', label: 'Item Code', field: 'itemCode', align: 'left' as const },
  { name: 'itemName', label: 'Item Name', field: 'itemName', align: 'left' as const },
  { name: 'borrower', label: 'Borrower', field: 'borrower', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'loanDate', label: 'Loan Date', field: 'loanDate', align: 'left' as const },
  { name: 'returnDate', label: 'Return Date', field: 'returnDate', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'note', label: 'Note', field: 'note', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editLoan = (loan: Loan) => {
  emit('edit', loan);
};
</script>
