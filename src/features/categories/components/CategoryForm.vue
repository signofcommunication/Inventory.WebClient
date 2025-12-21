<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ isEdit ? 'Edit Category' : 'Create Category' }}</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Name *"
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Name is required']"
          :disable="!canEdit"
        />

        <q-input
          v-model="form.description"
          label="Description"
          outlined
          type="textarea"
          :disable="!canEdit"
        />

        <div class="q-gutter-sm">
          <q-btn
            type="submit"
            :label="isEdit ? 'Update' : 'Create'"
            color="primary"
            :loading="loading"
            :disable="!canEdit"
          />
          <q-btn v-if="isEdit" label="Cancel" color="grey" flat @click="onCancel" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCategoriesStore } from '../store';
import { hasRole } from '../../../shared/permissions';
import type { CategoryForm as CategoryFormType } from '../types';

interface Props {
  category?: { id: number; name: string; description?: string } | null;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
});

const emit = defineEmits<{
  saved: [];
  cancelled: [];
}>();

const categoriesStore = useCategoriesStore();

const form = ref<CategoryFormType>({
  name: '',
  description: '',
});

const canEdit = computed(() => {
  if (props.isEdit) {
    return hasRole(['SUPERADMIN', 'ADMIN']);
  }
  return hasRole(['SUPERADMIN', 'ADMIN']);
});

const loading = computed(() => categoriesStore.loading);

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      form.value.name = newCategory.name;
      form.value.description = newCategory.description || '';
    } else {
      form.value.name = '';
      form.value.description = '';
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  try {
    if (props.isEdit && props.category) {
      await categoriesStore.updateCategory(props.category.id, form.value);
    } else {
      await categoriesStore.createCategory(form.value);
    }
    emit('saved');
  } catch (error) {
    // Error handled in store
  }
};

const onCancel = () => {
  emit('cancelled');
};
</script>
