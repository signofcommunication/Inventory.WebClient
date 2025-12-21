<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.itemCode"
      label="Item Code"
      outlined
      required
      :rules="[(val) => !!val || 'Item Code is required']"
    />
    <q-input v-model="form.itemName" label="Item Name" outlined />
    <q-input
      v-model.number="form.quantity"
      label="Quantity"
      type="number"
      outlined
      required
      :rules="[(val) => val > 0 || 'Quantity must be greater than 0']"
    />
    <q-input v-model="form.date" label="Date" type="date" outlined />
    <q-input v-model="form.note" label="Note" type="textarea" outlined />
    <div class="q-gutter-sm">
      <q-btn
        type="submit"
        :label="isEdit ? 'Update' : 'Simpan'"
        color="primary"
        :loading="loading"
      />
      <q-btn flat label="Cancel" @click="onCancel" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { StockOutForm } from '../types';

interface Props {
  modelValue: StockOutForm;
  isEdit: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: StockOutForm];
  cancel: [];
}>();

const form = ref<StockOutForm>({ ...props.modelValue });

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
