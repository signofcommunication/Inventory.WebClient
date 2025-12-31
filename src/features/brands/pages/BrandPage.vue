<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4>Manajemen Merek</h4>
      <q-btn
        v-if="canCreate"
        color="primary"
        icon="add"
        label="Tambah Merek"
        @click="showAddDialog = true"
      />
    </div>

    <BrandTable @edit="editBrand" @delete="confirmDelete" />

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <BrandForm
        :brand="currentBrand"
        :is-edit="isEdit"
        @saved="onSaved"
        @cancelled="onCancelled"
      />
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="2em" class="q-mr-md" />
          <span>Are you sure you want to delete this brand?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBrandsStore } from '../store';
import { hasRole } from 'src/shared/permissions';
import BrandTable from '../components/BrandTable.vue';
import BrandForm from '../components/BrandForm.vue';
import type { Brand } from '../types';

const brandsStore = useBrandsStore();

const showDialog = ref(false);
const showAddDialog = ref(false);
const isEdit = ref(false);
const currentBrand = ref<Brand | null>(null);
const showDeleteDialog = ref(false);
const brandToDelete = ref<Brand | null>(null);

const canCreate = hasRole(['SUPERADMIN', 'ADMIN']);

onMounted(() => {
  void brandsStore.fetchBrands();
});

const editBrand = (brand: Brand) => {
  isEdit.value = true;
  currentBrand.value = brand;
  showDialog.value = true;
};

const confirmDelete = (brand: Brand) => {
  brandToDelete.value = brand;
  showDeleteDialog.value = true;
};

const deleteConfirmed = () => {
  if (brandToDelete.value) {
    void brandsStore.deleteBrand(brandToDelete.value.id);
    showDeleteDialog.value = false;
    brandToDelete.value = null;
  }
};

const onSaved = () => {
  showDialog.value = false;
  currentBrand.value = null;
  isEdit.value = false;
};

const onCancelled = () => {
  showDialog.value = false;
  currentBrand.value = null;
  isEdit.value = false;
};

// Watch for showAddDialog to open dialog
watch(showAddDialog, (newVal) => {
  if (newVal) {
    isEdit.value = false;
    currentBrand.value = null;
    showDialog.value = true;
    showAddDialog.value = false;
  }
});
</script>
