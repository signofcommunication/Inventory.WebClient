<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.itemId"
      :options="items"
      option-value="id"
      option-label="name"
      label="Item"
      outlined
      required
      :rules="[(val) => !!val || 'Item is required']"
    />
    <q-input
      v-model="form.borrower"
      label="Borrower"
      outlined
      required
      :rules="[(val) => !!val || 'Borrower is required']"
    />
    <q-input
      v-model.number="form.quantity"
      label="Quantity"
      type="number"
      outlined
      required
      :rules="[(val) => val > 0 || 'Quantity must be greater than 0']"
    />
    <q-input
      v-model="form.returnDate"
      label="Return Date"
      type="date"
      outlined
      required
      :rules="[(val) => !!val || 'Return Date is required']"
    />
    <div class="q-gutter-sm">
      <q-btn type="submit" label="Create Loan" color="primary" :loading="loading" />
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
  emit('submit', form.value);
};

const onCancel = () => {
  emit('cancel');
};
</script>
