import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import type { SummaryReport, TransactionItem } from './types';

export const useReportsStore = defineStore('reports', () => {
  const loading = ref(false);
  const currentReport = ref('');
  const data = ref<TransactionItem[] | null>(null);
  const summary = ref<SummaryReport | null>(null);
  const generatedAt = ref('');

  const fetchReport = async (type: string) => {
    loading.value = true;
    try {
      const response = await api.get(`/reports/${type}`);
      if (type === 'summary') {
        summary.value = response.data.data || response.data;
        generatedAt.value = response.data.generatedAt || '';
      } else {
        const reportData = response.data.data;
        if (type === 'transactions' && typeof reportData === 'object' && reportData !== null) {
          // Combine stockIns and stockOuts into a single array with type field
          const combined: TransactionItem[] = [
            ...(reportData.stockIns || []).map((item: TransactionItem) => ({
              ...item,
              transactionType: 'Stock In',
            })),
            ...(reportData.stockOuts || []).map((item: TransactionItem) => ({
              ...item,
              transactionType: 'Stock Out',
            })),
          ];
          data.value = combined;
        } else {
          data.value = Array.isArray(reportData) ? reportData : [];
        }
        generatedAt.value = response.data.generatedAt;
      }
      currentReport.value = type;
    } catch (error: unknown) {
      console.error('Error fetching report:', error);
      if (type !== 'summary') {
        data.value = [];
      } else {
        summary.value = null;
      }
      Notify.create({
        message: 'Failed to fetch report',
        type: 'negative',
      });
    } finally {
      loading.value = false;
    }
  };

  const downloadPdf = async (type: string) => {
    loading.value = true;
    try {
      const response = await api.get(`/reports/${type}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      Notify.create({
        message: 'Report downloaded successfully',
        type: 'positive',
      });
    } catch (error: unknown) {
      console.error('Error downloading PDF:', error);
      Notify.create({
        message: 'Failed to download PDF',
        type: 'negative',
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    currentReport,
    data,
    summary,
    generatedAt,
    fetchReport,
    downloadPdf,
  };
});
