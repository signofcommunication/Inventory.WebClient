<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.item"
      :options="items"
      option-label="name"
      label="Item"
      outlined
      required
      :rules="[(val) => !!val || 'Item is required']"
    />
    <q-select
      v-model="form.supplier"
      :options="suppliers"
      option-label="name"
      label="Supplier"
      outlined
      required
      :rules="[(val) => !!val || 'Supplier is required']"
    />
    <q-input
      v-model.number="form.qty"
      label="Quantity"
      type="number"
      outlined
      required
      :rules="[(val) => val > 0 || 'Quantity must be greater than 0']"
    />
    <div class="q-gutter-sm">
      <q-btn type="submit" label="Create Stock In" color="primary" :loading="loading" />
      <q-btn flat label="Cancel" @click="onCancel" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { StockInFormData } from '../types';

interface Item {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Props {
  modelValue: StockInFormData;
  items: Item[];
  suppliers: Supplier[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: StockInFormData];
  cancel: [];
}>();

const form = ref<StockInFormData>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal };
  },
  { deep: true },
);

const onSubmit = () => {
  emit('submit', form.value);
};

const onCancel = () => {
  emit('cancel');
};
</script>
