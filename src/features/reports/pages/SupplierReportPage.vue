<template>
  <q-page class="q-pa-md">
    <ReportHeader title="Supplier Report" />
    <ReportToolbar :loading="loading" @refresh="refresh" @download="download" />
    <q-spinner v-show="loading" />
    <ReportTable v-if="!loading" :data="data || []" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useReportsStore } from '../store';
import ReportHeader from '../components/ReportHeader.vue';
import ReportToolbar from '../components/ReportToolbar.vue';
import ReportTable from '../components/ReportTable.vue';

const store = useReportsStore();
const loading = computed(() => store.loading);
const data = computed(() => store.data);

const refresh = () => {
  void store.fetchReport('suppliers');
};

const download = () => {
  void store.downloadPdf('suppliers');
};

onMounted(() => {
  refresh();
});
</script>
