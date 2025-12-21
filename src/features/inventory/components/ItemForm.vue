<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Name"
      outlined
      required
      :rules="[(val) => !!val || 'Name is required']"
    />
    <q-input
      v-model.number="form.stock"
      label="Stock"
      type="number"
      outlined
      required
      :rules="[(val) => val >= 0 || 'Stock must be 0 or more']"
    />
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
import type { ItemForm } from '../types';

interface Props {
  modelValue: ItemForm;
  isEdit: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: ItemForm];
  cancel: [];
}>();

const form = ref<ItemForm>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal };
  },
  { deep: true },
);

const onSubmit = () => {
  console.log('Payload to be sent:', form.value); // Debugging
  emit('submit', form.value);
};

const onCancel = () => {
  emit('cancel');
};
</script>
