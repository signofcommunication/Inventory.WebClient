<template>
  <q-table
    :rows="brands"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <div class="row q-gutter-xs">
          <q-btn
            v-if="canEdit"
            icon="edit"
            size="sm"
            color="primary"
            flat
            round
            @click="onEdit(props.row)"
          />
          <q-btn
            v-if="canDelete"
            icon="delete"
            size="sm"
            color="negative"
            flat
            round
            @click="onDelete(props.row)"
          />
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBrandsStore } from '../store';
import { hasRole } from '../../../shared/permissions';
import type { Brand } from '../types';

const emit = defineEmits<{
  edit: [brand: Brand];
  delete: [brand: Brand];
}>();

const brandsStore = useBrandsStore();

const brands = computed(() => brandsStore.brands);
const loading = computed(() => brandsStore.loading);

const canEdit = computed(() => hasRole(['SUPERADMIN', 'ADMIN']));
const canDelete = computed(() => hasRole(['SUPERADMIN']));

const columns = [
  {
    name: 'name',
    label: 'Name',
    align: 'left' as const,
    field: 'name',
  },
  {
    name: 'code',
    label: 'Code',
    align: 'left' as const,
    field: 'code',
  },
  {
    name: 'createdAt',
    label: 'Created At',
    align: 'left' as const,
    field: 'createdAt',
    format: (val: string) => (val ? new Date(val).toLocaleDateString() : ''),
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center' as const,
    field: '',
  },
];

const onEdit = (brand: Brand) => {
  emit('edit', brand);
};

const onDelete = (brand: Brand) => {
  emit('delete', brand);
};
</script>
