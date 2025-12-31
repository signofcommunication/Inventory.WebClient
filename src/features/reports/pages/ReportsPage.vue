<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Reports</div>
    <div class="row q-gutter-md">
      <q-card
        v-for="report in reports"
        :key="report.type"
        class="col-12 col-sm-6 col-md-4 cursor-pointer"
        @click="goToReport(report.type)"
      >
        <q-card-section>
          <q-icon :name="report.icon" size="md" class="q-mb-sm" />
          <div class="text-h6">{{ report.title }}</div>
          <div class="text-caption">{{ report.description }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const reports = [
  {
    type: 'stock',
    title: 'Stock Report',
    description: 'View current stock levels',
    icon: 'inventory',
  },
  {
    type: 'transactions',
    title: 'Transaction Report',
    description: 'View all transactions',
    icon: 'swap_horiz',
  },
  { type: 'loans', title: 'Loan Report', description: 'View loan activities', icon: 'assignment' },
  {
    type: 'suppliers',
    title: 'Supplier Report',
    description: 'View supplier information',
    icon: 'business',
  },
  {
    type: 'summary',
    title: 'Summary Report',
    description: 'Overall system summary',
    icon: 'bar_chart',
  },
  {
    type: 'user-activity',
    title: 'User Activity Report',
    description: 'View user activities',
    icon: 'people',
  },
];

const goToReport = (type: string) => {
  void router.push(`/reports/${type}`);
};
</script>
