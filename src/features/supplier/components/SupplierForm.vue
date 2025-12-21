<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Name"
      outlined
      required
      :rules="[(val) => !!val || 'Name is required']"
    />
    <q-input v-model="form.phone" label="Phone" outlined />
    <q-input v-model="form.address" label="Address" type="textarea" outlined />
    <div class="q-gutter-sm">
      <q-btn
        type="submit"
        :label="isEdit ? 'Update' : 'Create'"
        color="primary"
        :loading="loading"
      />
      <q-btn flat label="Cancel" @click="onCancel" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SupplierForm } from '../types';

interface Props {
  modelValue: SupplierForm;
  isEdit: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: SupplierForm];
  cancel: [];
}>();

const form = ref<SupplierForm>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal };
  },
  { deep: true },
);

const onSubmit = () => {
  const payload: SupplierForm = {
    name: form.value.name,
    ...(form.value.phone && { phone: form.value.phone }),
    ...(form.value.address && { address: form.value.address }),
  };
  emit('submit', payload);
};

const onCancel = () => {
  emit('cancel');
};
</script>
