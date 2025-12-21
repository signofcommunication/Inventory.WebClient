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
import type { Item } from '../types';

interface Props {
  items: Item[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [item: Item];
}>();

const columns = [
  { name: 'code', label: 'Code', field: 'code', align: 'left' as const },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'description', label: 'Description', field: 'description', align: 'left' as const },
  { name: 'category', label: 'Category', field: 'category', align: 'left' as const },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'unit', label: 'Unit', field: 'unit', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editItem = (item: Item) => {
  emit('edit', item);
};
</script>
