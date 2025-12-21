<template>
  <q-table :rows="stockIns" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
  </q-table>
</template>

<script setup lang="ts">
import type { StockIn } from '../types';

interface Props {
  stockIns: StockIn[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const columns = [
  { name: 'itemId', label: 'Item ID', field: 'itemId', align: 'left' as const },
  { name: 'supplierId', label: 'Supplier ID', field: 'supplierId', align: 'left' as const },
  { name: 'qty', label: 'Quantity', field: 'qty', align: 'right' as const },
  { name: 'date', label: 'Date', field: 'date', align: 'left' as const },
];
</script>
