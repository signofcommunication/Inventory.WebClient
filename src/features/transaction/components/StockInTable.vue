<template>
  <q-table :rows="items" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="edit" color="primary" @click="editItem(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { StockInItem } from '../types';

interface Props {
  items: StockInItem[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [item: StockInItem];
}>();

const columns = [
  { name: 'itemCode', label: 'Item Code', field: 'itemCode', align: 'left' as const },
  { name: 'itemName', label: 'Item Name', field: 'itemName', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'date', label: 'Date', field: 'date', align: 'left' as const },
  { name: 'supplier', label: 'Supplier', field: 'supplier', align: 'left' as const },
  { name: 'note', label: 'Note', field: 'note', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editItem = (item: StockInItem) => {
  emit('edit', item);
};
</script>
