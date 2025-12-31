<template>
  <q-card class="q-pa-md q-mb-md">
    <q-card-section>
      <q-btn
        label="Refresh"
        icon="refresh"
        color="primary"
        :loading="loading"
        @click="$emit('refresh')"
      />
      <q-btn
        label="Download PDF"
        icon="download"
        color="secondary"
        :loading="loading"
        @click="$emit('download')"
        class="q-ml-md"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  refresh: [];
  download: [];
}>();
</script>
