<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ isEdit ? 'Edit Item' : 'Create Item' }}</div>
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

        <q-select
          v-model="form.brandId"
          :options="brandOptions"
          option-value="id"
          option-label="name"
          label="Brand *"
          outlined
          emit-value
          map-options
          :rules="[(val) => !!val || 'Brand is required']"
          :disable="!canEdit"
        />

        <q-select
          v-model="form.categoryId"
          :options="categoryOptions"
          option-value="id"
          option-label="name"
          label="Category *"
          outlined
          emit-value
          map-options
          :rules="[(val) => !!val || 'Category is required']"
          :disable="!canEdit"
        />

        <q-file
          v-model="selectedFile"
          label="Item Image *"
          outlined
          accept="image/*"
          max-file-size="2097152"
          :rules="[(val) => !!val || 'Image is required']"
          :disable="!canEdit"
        >
          <template #file="{ file }">
            <q-chip
              :removable="canEdit"
              @remove="selectedFile = null"
              text-color="white"
              color="primary"
            >
              {{ file.name }}
            </q-chip>
          </template>
        </q-file>

        <q-input
          v-if="isEdit && currentItem"
          v-model="currentItem.itemCode"
          label="Item Code"
          outlined
          readonly
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
import { ref, computed, watch, onMounted } from 'vue';
import { useItemsStore } from '../store';
import { useBrandsStore } from '../../brands/store';
import { useCategoriesStore } from '../../categories/store';
import { hasRole } from '../../../shared/permissions';
import type { ItemForm as ItemFormType, Item } from '../types';

interface Props {
  item?: Item | null;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
});

const emit = defineEmits<{
  saved: [];
  cancelled: [];
}>();

const itemsStore = useItemsStore();
const brandsStore = useBrandsStore();
const categoriesStore = useCategoriesStore();

const form = ref<ItemFormType>({
  name: '',
  brandId: '',
  categoryId: 0,
  imageUrl: '',
});

const selectedFile = ref<File | null>(null);

const canEdit = computed(() => {
  if (props.isEdit) {
    return hasRole(['SUPERADMIN', 'ADMIN']);
  }
  return hasRole(['SUPERADMIN', 'ADMIN']);
});

const loading = computed(() => itemsStore.loading);
const brandOptions = computed(() => brandsStore.brands);
const categoryOptions = computed(() => categoriesStore.categories);

const currentItem = ref<Item | null>(null);

onMounted(() => {
  void brandsStore.fetchBrands();
  void categoriesStore.fetchCategories();
});

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      form.value.name = newItem.name;
      form.value.brandId = newItem.brandId;
      form.value.categoryId = newItem.categoryId;
      form.value.imageUrl = newItem.imageUrl;
      currentItem.value = newItem;
    } else {
      form.value.name = '';
      form.value.brandId = '';
      form.value.categoryId = 0;
      form.value.imageUrl = '';
      currentItem.value = null;
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (props.isEdit && props.item) {
    await itemsStore.updateItem(props.item.id, form.value);
  } else {
    if (selectedFile.value) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('brandId', form.value.brandId);
      formData.append('categoryId', form.value.categoryId.toString());
      formData.append('image', selectedFile.value);
      await itemsStore.createItem(formData);
    } else {
      await itemsStore.createItem(form.value);
    }
  }
  emit('saved');
};

const onCancel = () => {
  emit('cancelled');
};
</script>
