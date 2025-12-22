<template>
  <q-table :rows="items" :columns="columns" row-key="id" :loading="loading" class="q-mb-md">
    <template #body-cell-foto="props">
      <q-td :props="props">
        <q-img
          v-if="props.row.fotoBarang"
          :src="props.row.fotoBarang"
          style="width: 50px; height: 50px; object-fit: cover"
        />
        <q-icon v-else name="image" size="50px" color="grey" />
      </q-td>
    </template>
    <template #body-cell-quantity="props">
      <q-td :props="props">
        <q-badge :color="props.row.quantity === 0 ? 'red' : 'green'" :label="props.row.quantity" />
      </q-td>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props" v-if="hasRole(['SUPERADMIN', 'ADMIN'])">
        <q-btn flat round icon="edit" color="primary" @click="editItem(props.row)" />
        <q-btn flat round icon="delete" color="negative" @click="deleteItem(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { Item } from '../types';
import { hasRole } from '../../../shared/permissions';

interface Props {
  items: Item[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [item: Item];
  delete: [item: Item];
}>();

const columns = [
  { name: 'foto', label: 'Foto', field: '', align: 'center' as const },
  { name: 'kodeBarang', label: 'Kode Barang', field: 'kodeBarang', align: 'left' as const },
  { name: 'namaBarang', label: 'Nama Barang', field: 'namaBarang', align: 'left' as const },
  {
    name: 'category',
    label: 'Kategori',
    field: 'category',
    align: 'left' as const,
    format: (val: { name?: string } | undefined) => val?.name || 'Unknown',
  },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
  { name: 'unit', label: 'Unit', field: 'unit', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const editItem = (item: Item) => {
  emit('edit', item);
};

const deleteItem = (item: Item) => {
  emit('delete', item);
};
</script>
