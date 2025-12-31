<template>
  <q-card class="q-pa-md q-mb-md">
    <q-card-section>
      <div class="text-h5">{{ title }}</div>
      <div v-if="generatedAt" class="text-caption">Generated at: {{ generatedAt }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  generatedAt?: string;
}

withDefaults(defineProps<Props>(), {
  generatedAt: '',
});
</script>
