<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.kodeBarang"
      label="Kode Barang"
      outlined
      required
      :readonly="isEdit"
      :rules="kodeBarangRules"
    />
    <q-input
      v-model="form.namaBarang"
      label="Nama Barang"
      outlined
      required
      :rules="[(val) => !!val || 'Nama Barang is required']"
    />
    <q-select
      v-model="form.kategoriId"
      :options="categories"
      option-value="id"
      option-label="name"
      label="Kategori"
      outlined
      required
      :rules="[(val) => (!!val && !isNaN(Number(val))) || 'Kategori is required']"
      emit-value
      map-options
    />
    <q-select
      v-model="form.unit"
      :options="unitOptions"
      label="Unit"
      outlined
      required
      :rules="[(val) => !!val || 'Unit is required']"
    />
    <q-file
      v-model="form.fotoBarang"
      label="Foto Barang"
      outlined
      accept=".jpg,.jpeg,.png"
      max-file-size="2097152"
      :rules="fotoRules"
      @rejected="onRejected"
    >
      <template #file="{ file }">
        <q-chip
          :removable="true"
          @remove="form.fotoBarang = null"
          color="primary"
          text-color="white"
        >
          {{ file.name }}
        </q-chip>
      </template>
    </q-file>
    <div v-if="previewImage" class="q-mb-md">
      <q-img :src="previewImage" style="max-width: 200px; max-height: 200px" />
    </div>
    <div class="q-gutter-sm">
      <q-btn
        type="submit"
        :label="isEdit ? 'Update' : 'Simpan'"
        color="primary"
        :loading="loading"
        :disable="!canSubmit"
      />
      <q-btn flat label="Cancel" @click="onCancel" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { ItemForm } from '../types';
import { useQuasar } from 'quasar';
import { useCategoriesStore } from '../../categories/store';

interface Props {
  modelValue: ItemForm;
  isEdit: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [form: FormData];
  cancel: [];
}>();

const $q = useQuasar();
const categoriesStore = useCategoriesStore();

const form = ref<ItemForm>({ ...props.modelValue });
const categories = computed(() => categoriesStore.categories);
const unitOptions = ['pcs', 'unit', 'box', 'kg', 'liter', 'meter'];
const previewImage = ref<string | null>(null);

const kodeBarangRules = computed(() => [
  (val: string) => !!val || 'Kode Barang is required',
  (val: string) => val.length >= 3 || 'Kode Barang must be at least 3 characters',
]);

const fotoRules = [
  (files: File[] | null) =>
    !files ||
    files.length === 0 ||
    (files[0] && files[0].size <= 2097152) ||
    'File size must be less than 2MB',
  (files: File[] | null) =>
    !files ||
    files.length === 0 ||
    (files[0] && ['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type)) ||
    'File must be JPG, JPEG, or PNG',
];

const canSubmit = computed(() => {
  return (
    !!form.value.kodeBarang &&
    !!form.value.namaBarang &&
    form.value.kategoriId !== null &&
    form.value.kategoriId !== undefined &&
    !isNaN(Number(form.value.kategoriId)) &&
    !!form.value.unit
  );
});

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal };
    if (props.isEdit && typeof newVal.fotoBarang === 'string') {
      previewImage.value = newVal.fotoBarang;
    }
  },
  { deep: true },
);

watch(
  () => form.value.fotoBarang,
  (newFile) => {
    if (newFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string;
      };
      reader.readAsDataURL(newFile);
    } else {
      previewImage.value = null;
    }
  },
);

watch(
  () => form.value.kategoriId,
  (newVal) => {
    if (newVal !== null && newVal !== undefined) {
      form.value.kategoriId = Number(newVal);
    }
  },
);

onMounted(async () => {
  // categories.value = itemStore.getCategories();
});

const onRejected = (rejectedEntries: unknown) => {
  const entries = rejectedEntries as { failedPropValidation: string }[];
  $q.notify({
    type: 'negative',
    message: 'File rejected: ' + (entries[0]?.failedPropValidation || 'Unknown error'),
  });
};

const onSubmit = () => {
  if (form.value.kategoriId === null || form.value.kategoriId === undefined) {
    return; // Should not happen due to validation
  }

  const formData = new FormData();
  formData.append('kodeBarang', form.value.kodeBarang);
  formData.append('namaBarang', form.value.namaBarang);
  formData.append('kategoriId', Number(form.value.kategoriId).toString());
  formData.append('unit', form.value.unit);
  if (form.value.fotoBarang) {
    formData.append('fotoBarang', form.value.fotoBarang);
  }
  emit('submit', formData);
};

const onCancel = () => {
  emit('cancel');
};
</script>
