<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Laporan</div>
    <div class="text-body1 q-mb-xl">Inventory reports</div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="report" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Total Barang</div>
          <div class="text-h4 text-primary">{{ report.totalItems }}</div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Total Barang Masuk</div>
          <div class="text-h4 text-positive">{{ report.totalStockIn }}</div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Total Barang Keluar</div>
          <div class="text-h4 text-negative">{{ report.totalStockOut }}</div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Stok Tersedia</div>
          <div class="text-h4 text-info">{{ report.availableStock }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="text-center q-pa-lg">
      <q-icon name="error" size="3em" color="negative" />
      <div class="q-mt-md">Failed to load reports</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../../boot/axios';

interface Report {
  totalItems: number;
  totalStockIn: number;
  totalStockOut: number;
  availableStock: number;
}

const report = ref<Report | null>(null);
const loading = ref(false);

const fetchReport = async () => {
  loading.value = true;
  try {
    const response = await api.get('/reports/stock');
    report.value = response.data.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    report.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void fetchReport();
});
</script>
