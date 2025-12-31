<template>
  <div class="row q-gutter-md">
    <q-card v-for="stat in stats" :key="stat.key" class="col-12 col-sm-6 col-md-4">
      <q-card-section class="text-center">
        <q-icon :name="getIcon(stat.key)" size="3rem" color="primary" class="q-mb-sm" />
        <div class="text-h6 q-mb-xs">{{ formatHeader(stat.key) }}</div>
        <div class="text-h4 text-weight-bold">{{ formatNumber(stat.value) }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SummaryReport } from '../types';

interface Props {
  summary: SummaryReport;
}

const props = defineProps<Props>();

const headerMap: Record<string, string> = {
  totalItems: 'Total Items',
  totalSuppliers: 'Total Suppliers',
  totalStockIn: 'Total Stock In',
  totalStockOut: 'Total Stock Out',
  totalLoans: 'Total Loans',
  totalUsers: 'Total Users',
};

const iconMap: Record<string, string> = {
  totalItems: 'inventory',
  totalSuppliers: 'business',
  totalStockIn: 'input',
  totalStockOut: 'output',
  totalLoans: 'assignment',
  totalUsers: 'people',
};

const formatHeader = (key: string): string => {
  return headerMap[key] || key;
};

const getIcon = (key: string): string => {
  return iconMap[key] || 'bar_chart';
};

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

const stats = computed(() => {
  if (!props.summary) return [];
  if (Array.isArray(props.summary)) {
    return props.summary;
  } else {
    return Object.entries(props.summary).map(([key, value]) => ({ key, value: value as number }));
  }
});
</script>
