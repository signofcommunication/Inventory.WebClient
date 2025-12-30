<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ isEdit ? 'Edit Brand' : 'Create Brand' }}</div>
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
          v-model="form.code"
          label="Code *"
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Code is required']"
          :disable="props.isEdit"
          @input="form.code = form.code.toUpperCase()"
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
import { useBrandsStore } from '../store';
import { hasRole } from '../../../shared/permissions';
import type { Brand, BrandForm as BrandFormType } from '../types';

interface Props {
  brand?: Brand | null;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
});

const emit = defineEmits<{
  saved: [];
  cancelled: [];
}>();

const brandsStore = useBrandsStore();

const form = ref<BrandFormType>({
  name: '',
  code: '',
});

const canEdit = computed(() => {
  if (props.isEdit) {
    return hasRole(['SUPERADMIN', 'ADMIN']);
  }
  return hasRole(['SUPERADMIN', 'ADMIN']);
});

const loading = computed(() => brandsStore.loading);

watch(
  () => props.brand,
  (newBrand) => {
    if (newBrand) {
      form.value.name = newBrand.name;
      form.value.code = newBrand.code;
    } else {
      form.value.name = '';
      form.value.code = '';
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (props.isEdit && props.brand) {
    await brandsStore.updateBrand(props.brand.id, form.value);
  } else {
    await brandsStore.createBrand(form.value);
  }
  emit('saved');
};

const onCancel = () => {
  emit('cancelled');
};
</script>
