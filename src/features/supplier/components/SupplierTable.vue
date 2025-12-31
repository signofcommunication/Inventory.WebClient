<template>
  <q-table
    :rows="props.suppliers"
    :columns="columns"
    row-key="id"
    :loading="props.loading"
    class="q-mb-md"
  >
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="edit" color="primary" @click="editSupplier(props.row)" />
        <q-btn flat round icon="delete" color="negative" @click="deleteSupplier(props.row)" />
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
  delete: [supplier: Supplier];
}>();

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' as const },
  { name: 'address', label: 'Address', field: 'address', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editSupplier = (supplier: Supplier) => {
  emit('edit', supplier);
};

const deleteSupplier = (supplier: Supplier) => {
  emit('delete', supplier);
};
</script>
