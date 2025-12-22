<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.itemId"
      :options="items"
      option-value="id"
      :option-label="(item) => item.name"
      label="Item"
      outlined
      required
      :rules="[(val) => val > 0 || 'Item is required']"
      :loading="loading"
      :disable="loading"
    />
    <q-input
      v-model="form.borrowerName"
      label="Borrower Name"
      outlined
      required
      :rules="[(val) => !!val || 'Borrower Name is required']"
    />
    <q-input
      v-model.number="form.qty"
      label="Quantity"
      type="number"
      outlined
      required
      :rules="[(val) => val > 0 || 'Quantity must be greater than 0']"
    />
    <q-input
      v-model="form.startDate"
      label="Start Date"
      type="datetime-local"
      outlined
      required
      :rules="[(val) => !!val || 'Start Date is required']"
    />
    <q-input
      v-model="form.endDate"
      label="End Date"
      type="datetime-local"
      outlined
      required
      :rules="[(val) => !!val || 'End Date is required']"
    />
    <q-input
      v-model="form.purpose"
      label="Purpose"
      outlined
      required
      :rules="[(val) => !!val || 'Purpose is required']"
    />
    <div class="q-gutter-sm">
      <q-btn @click="onSubmit" label="Create Loan" color="primary" :loading="loading" />
      <q-btn flat label="Cancel" @click="onCancel" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LoanForm } from '../types';

interface Item {
  id: number;
  name: string;
}

interface Props {
  modelValue: LoanForm;
  items: Item[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: LoanForm];
  cancel: [];
}>();

const form = ref<LoanForm>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal };
  },
  { deep: true },
);

const onSubmit = () => {
  console.log('Form submitted', form.value); // Debug log
  emit('submit', form.value);
};

const onCancel = () => {
  emit('cancel');
};
</script>
