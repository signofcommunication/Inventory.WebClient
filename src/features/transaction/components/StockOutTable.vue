<template>
  <q-table
    :rows="props.stockOuts"
    :columns="columns"
    row-key="id"
    :loading="props.loading"
    class="q-mb-md"
  >
  </q-table>
</template>

<script setup lang="ts">
import type { StockOut } from '../types';

interface Props {
  stockOuts: StockOut[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const columns = [
  { name: 'itemId', label: 'Item ID', field: 'itemId', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'borrower', label: 'Borrower', field: 'borrower', align: 'left' as const },
  { name: 'date', label: 'Date', field: 'date', align: 'left' as const },
];
</script>
