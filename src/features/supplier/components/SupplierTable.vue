<template>
  <q-table :rows="suppliers" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="edit" color="primary" @click="editSupplier(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { Supplier } from '../types';

interface Props {
  suppliers: Supplier[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [supplier: Supplier];
}>();

const columns = [
  { name: 'code', label: 'Code', field: 'code', align: 'left' as const },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'contact', label: 'Contact', field: 'contact', align: 'left' as const },
  { name: 'address', label: 'Address', field: 'address', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editSupplier = (supplier: Supplier) => {
  emit('edit', supplier);
};
</script>
