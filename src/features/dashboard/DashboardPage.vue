<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Dashboard</div>
    <div class="text-body1 q-mb-xl">Overview of inventory system</div>

    <div class="row q-gutter-md">
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="mdi-package-variant" size="2rem" color="primary" />
            <div>
              <div class="text-h6">Total Items</div>
              <div class="text-h4 text-primary">{{ totalItems }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="mdi-handshake" size="2rem" color="secondary" />
            <div>
              <div class="text-h6">Active Loans</div>
              <div class="text-h4 text-secondary">{{ activeLoans }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="mdi-truck" size="2rem" color="info" />
            <div>
              <div class="text-h6">Total Suppliers</div>
              <div class="text-h4 text-info">{{ totalSuppliers }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Overview Chart</div>
        <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="300" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useItemsStore } from '../inventory/store';
import { useLoanStore } from '../loan/store';
import { useSupplierStore } from '../supplier/store';

const itemsStore = useItemsStore();
const loanStore = useLoanStore();
const supplierStore = useSupplierStore();

onMounted(() => {
  void itemsStore.fetchItems();
  void loanStore.fetchLoans();
  void supplierStore.fetchSuppliers();
});

const totalItems = computed(() => itemsStore.items.length);
const activeLoans = computed(
  () => loanStore.loans.filter((loan) => loan.status === 'APPROVED').length,
);
const totalSuppliers = computed(() => supplierStore.suppliers.length);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Total Items', 'Active Loans', 'Total Suppliers'],
  },
  yaxis: {
    title: {
      text: 'Count',
    },
  },
  fill: {
    opacity: 1,
  },
  colors: ['#1976d2', '#dc004e', '#2196f3'],
  tooltip: {
    y: {
      formatter: (val: number) => val.toString(),
    },
  },
}));

const chartSeries = computed(() => [
  {
    name: 'Count',
    data: [totalItems.value, activeLoans.value, totalSuppliers.value],
  },
]);
</script>
