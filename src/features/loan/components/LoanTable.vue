<template>
  <q-table :rows="loans" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="delete" color="negative" @click="deleteLoan(props.row)" />
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
}>();

const columns = [
  { name: 'itemId', label: 'Item ID', field: 'itemId', align: 'left' as const },
  { name: 'borrower', label: 'Borrower', field: 'borrower', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'returnDate', label: 'Return Date', field: 'returnDate', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const deleteLoan = (loan: Loan) => {
  emit('delete', loan);
};
</script>
