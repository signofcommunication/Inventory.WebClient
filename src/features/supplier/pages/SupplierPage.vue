<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Data Supplier</div>
    <div class="text-body1 q-mb-xl">Manage supplier data</div>

    <q-btn label="Tambah Supplier" color="primary" @click="openAddDialog" class="q-mb-md" />

    <SupplierTable
      :suppliers="supplierStore.suppliers"
      :loading="supplierStore.loading"
      @edit="openEditDialog"
      @delete="onDelete"
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
import { ref, reactive, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useSupplierStore } from '../store';
import SupplierTable from '../components/SupplierTable.vue';
import SupplierForm from '../components/SupplierForm.vue';
import type { SupplierForm as SupplierFormData } from '../types';

const supplierStore = useSupplierStore();

const dialogOpen = ref(false);
const isEdit = ref(false);
const formData = reactive<SupplierFormData>({
  name: '',
  phone: '',
  address: '',
});

onMounted(() => {
  supplierStore.fetchSuppliers();
});

const openAddDialog = () => {
  isEdit.value = false;
  formData.name = '';
  formData.phone = '';
  formData.address = '';
  dialogOpen.value = true;
};

const openEditDialog = (supplier: any) => {
  isEdit.value = true;
  formData.name = supplier.name;
  formData.phone = supplier.phone || '';
  formData.address = supplier.address || '';
  supplierStore.selectSupplier(supplier);
  dialogOpen.value = true;
};

const onSubmit = async (data: SupplierFormData) => {
  try {
    if (isEdit.value && supplierStore.selectedSupplier) {
      await supplierStore.updateSupplier(supplierStore.selectedSupplier.id, data);
      Notify.create({ type: 'positive', message: 'Supplier updated successfully' });
    } else {
      await supplierStore.createSupplier(data);
      Notify.create({ type: 'positive', message: 'Supplier created successfully' });
    }
    closeDialog();
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error saving supplier' });
  }
};

const onDelete = async (supplier: any) => {
  try {
    await supplierStore.deleteSupplier(supplier.id);
    Notify.create({ type: 'positive', message: 'Supplier deleted successfully' });
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error deleting supplier' });
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
  supplierStore.selectSupplier(null);
};
</script>
