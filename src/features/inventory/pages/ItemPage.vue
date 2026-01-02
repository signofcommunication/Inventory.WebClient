<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4>Item Management</h4>
      <q-btn
        v-if="canCreate"
        color="primary"
        icon="add"
        label="Add Item"
        @click="showAddDialog = true"
      />
    </div>

    <ItemTable @edit="editItem" />

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <ItemForm :item="currentItem" :is-edit="isEdit" @saved="onSaved" @cancelled="onCancelled" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useItemsStore } from '../store';
import { useBrandsStore } from '../../brands/store';
import { useCategoriesStore } from '../../categories/store';
import { hasRole } from '../../../shared/permissions';
import ItemTable from '../components/ItemTable.vue';
import ItemForm from '../components/ItemForm.vue';
import type { Item } from '../types';

const itemsStore = useItemsStore();
const brandsStore = useBrandsStore();
const categoriesStore = useCategoriesStore();

const showDialog = ref(false);
const showAddDialog = ref(false);
const isEdit = ref(false);
const currentItem = ref<Item | null>(null);

const canCreate = hasRole(['SUPERADMIN', 'ADMIN']);

onMounted(() => {
  void itemsStore.fetchItems();
  void brandsStore.fetchBrands();
  void categoriesStore.fetchCategories();
});

const editItem = (item: Item) => {
  isEdit.value = true;
  currentItem.value = item;
  showDialog.value = true;
};

const onSaved = () => {
  showDialog.value = false;
  currentItem.value = null;
  isEdit.value = false;
};

const onCancelled = () => {
  showDialog.value = false;
  currentItem.value = null;
  isEdit.value = false;
};

// Watch for showAddDialog to open dialog
watch(showAddDialog, (newVal) => {
  if (newVal) {
    isEdit.value = false;
    currentItem.value = null;
    showDialog.value = true;
    showAddDialog.value = false;
  }
});
</script>
