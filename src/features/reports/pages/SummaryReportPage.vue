<template>
  <q-page class="q-pa-md">
    <ReportHeader title="Summary Report" :generatedAt="generatedAt" />
    <ReportToolbar :loading="loading" @refresh="refresh" @download="download" />
    <q-spinner v-show="loading" />
    <ReportStatCard v-if="!loading && summary" :summary="summary" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useReportsStore } from '../store';
import ReportHeader from '../components/ReportHeader.vue';
import ReportToolbar from '../components/ReportToolbar.vue';
import ReportStatCard from '../components/ReportStatCard.vue';

const store = useReportsStore();
const loading = computed(() => store.loading);
const summary = computed(() => store.summary);
const generatedAt = computed(() => store.generatedAt);

const refresh = () => {
  void store.fetchReport('summary');
};

const download = () => {
  void store.downloadPdf('summary');
};

onMounted(() => {
  refresh();
});
</script>
