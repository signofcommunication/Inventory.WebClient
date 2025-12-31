<template>
  <q-table :rows="data" :columns="columns" row-key="id">
    <template #no-data>
      <div class="text-center q-pa-md">No data available</div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  data: any[];
}

const props = defineProps<Props>();

const headerMap: Record<string, string> = {
  totalUsers: 'Total Users',
  totalStockIn: 'Total Stock In',
  totalStockOut: 'Total Stock Out',
  createdAt: 'Created Date',
  userName: 'User Name',
  itemCode: 'Item Code',
  brandName: 'Brand Name',
  categoryName: 'Category Name',
  supplierName: 'Supplier Name',
  loanDate: 'Loan Date',
  returnDate: 'Return Date',
  transactionType: 'Transaction Type',
  // add more as needed
};

const formatHeader = (key: string): string => {
  return headerMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const columns = computed(() => {
  if (!props.data || props.data.length === 0) return [];
  const keys = Object.keys(props.data[0]);
  return keys.map((key) => ({
    name: key,
    label: formatHeader(key),
    field: key,
    align: 'left' as const,
  }));
});
</script>
