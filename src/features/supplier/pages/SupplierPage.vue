<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Data Supplier</div>
    <div class="text-body1 q-mb-xl">Manage supplier data</div>

    <q-btn label="Tambah Supplier" color="primary" @click="openAddDialog" class="q-mb-md" />

    <SupplierTable
      :suppliers="supplierStore.suppliers"
      :loading="supplierStore.loading"
      @edit="openEditDialog"
    />

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Supplier' : 'Add Supplier' }}</div>
        </q-card-section>
        <q-card-section>
          <SupplierForm
            :model-value="formData"
            :is-edit="isEdit"
            :loading="supplierStore.loading"
            @submit="onSubmit"
            @cancel="closeDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useSupplierStore } from '../store';
import SupplierTable from '../components/SupplierTable.vue';
import SupplierForm from '../components/SupplierForm.vue';
import type { SupplierForm as SupplierFormData } from '../types';

const supplierStore = useSupplierStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<SupplierFormData>({
  code: '',
  name: '',
  contact: '',
  address: '',
  email: '',
  phone: '',
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.code = '';
  formData.name = '';
  formData.contact = '';
  formData.address = '';
  formData.email = '';
  formData.phone = '';
  dialogOpen.value = true;
};

const openEditDialog = (supplier: any) => {
  isEdit.value = true;
  formData.code = supplier.code;
  formData.name = supplier.name;
  formData.contact = supplier.contact;
  formData.address = supplier.address;
  formData.email = supplier.email;
  formData.phone = supplier.phone;
  supplierStore.selectSupplier(supplier);
  dialogOpen.value = true;
};

const onSubmit = (data: SupplierFormData) => {
  if (isEdit.value && supplierStore.selectedSupplier) {
    supplierStore.updateSupplier(supplierStore.selectedSupplier.id, data);
  } else {
    supplierStore.createSupplier(data);
  }
  closeDialog();
};

const closeDialog = () => {
  dialogOpen.value = false;
  supplierStore.selectSupplier(null);
};
</script>
