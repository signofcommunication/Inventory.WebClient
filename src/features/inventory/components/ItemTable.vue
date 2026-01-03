<template>
  <q-table
    :rows="items"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body-cell-image="props">
      <q-td :props="props">
        <q-img
          v-if="props.row.imageUrl"
          :src="getFullImageUrl(props.row.imageUrl)"
          :alt="props.row.name"
          width="50px"
          height="50px"
          class="rounded-borders"
        />
        <q-icon v-else name="image" size="2rem" color="grey" />
      </q-td>
    </template>
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
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useItemsStore } from '../store';
import { useBrandsStore } from '../../brands/store';
import { useCategoriesStore } from '../../categories/store';
import { hasRole } from '../../../shared/permissions';
import type { Item } from '../types';

const emit = defineEmits<{
  edit: [item: Item];
}>();

const itemsStore = useItemsStore();
const brandsStore = useBrandsStore();
const categoriesStore = useCategoriesStore();

const items = computed(() => itemsStore.items);
const loading = computed(() => itemsStore.loading);

const canEdit = computed(() => hasRole(['SUPERADMIN', 'ADMIN']));

const backendBaseUrl = 'http://localhost:3000'; // Sesuaikan dengan port backend Anda

const getFullImageUrl = (imageUrl: string) => {
  return imageUrl ? `${backendBaseUrl}${imageUrl}` : '';
};

const getBrandName = (brandId: string) => {
  const brand = brandsStore.getBrandById(brandId);
  return brand ? brand.name : 'Unknown';
};

const columns = [
  {
    name: 'itemCode',
    label: 'Item Code',
    align: 'left' as const,
    field: 'itemCode',
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left' as const,
    field: 'name',
  },
  {
    name: 'brand',
    label: 'Brand',
    align: 'left' as const,
    field: 'brandId',
    format: (val: string) => getBrandName(val),
  },
  {
    name: 'category',
    label: 'Category',
    align: 'left' as const,
    field: 'categoryId',
    format: (val: number) => {
      const category = categoriesStore.getCategoryById(val);
      return category ? category.name : 'Unknown';
    },
  },
  {
    name: 'image',
    label: 'Image',
    align: 'center' as const,
    field: 'imageUrl',
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

const onEdit = (item: Item) => {
  emit('edit', item);
};
</script>
