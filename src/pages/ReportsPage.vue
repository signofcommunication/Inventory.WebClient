<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Inventory Reports</div>

    <div class="row q-gutter-md">
      <q-card class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Total Items</div>
          <div class="text-h4 text-primary">{{ totalItems }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Total Categories</div>
          <div class="text-h4 text-secondary">{{ totalCategories }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Low Stock Items</div>
          <div class="text-h4 text-negative">{{ lowStockItems }}</div>
          <div class="text-caption">Items with quantity < 5</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-lg">
      <h5>Items by Category</h5>
      <q-table
        :rows="itemsByCategory"
        :columns="categoryColumns"
        row-key="category"
        :loading="loading"
        class="q-mt-md"
      />
    </div>

    <div class="q-mt-lg">
      <h5>Top 5 Most Expensive Items</h5>
      <q-table
        :rows="topExpensiveItems"
        :columns="itemColumns"
        row-key="id"
        :loading="loading"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useItemsStore } from 'src/features/items/store';
import { useCategoriesStore } from 'src/features/categories/store';
import type { Item } from 'src/features/items/types';

const itemsStore = useItemsStore();
const categoriesStore = useCategoriesStore();

const loading = ref(false);

const totalItems = computed(() => itemsStore.items.length);
const totalCategories = computed(() => categoriesStore.categories.length);
const lowStockItems = computed(() => itemsStore.items.filter((item) => item.quantity < 5).length);

const itemsByCategory = computed(() => {
  const categoryMap = new Map<string, number>();
  itemsStore.items.forEach((item) => {
    const category = categoriesStore.getCategoryById(item.categoryId);
    const catName = category?.name || 'Unknown';
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
  });
  return Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));
});

const topExpensiveItems = computed(() => {
  return [...itemsStore.items].sort((a, b) => b.price - a.price).slice(0, 5);
});

const categoryColumns = [
  { name: 'category', label: 'Category', field: 'category', align: 'left' as const },
  { name: 'count', label: 'Item Count', field: 'count', align: 'right' as const },
];

const itemColumns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  {
    name: 'price',
    label: 'Price',
    field: (row: Item) => `Rp ${row.price.toLocaleString()}`,
    align: 'right' as const,
  },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'right' as const },
];
</script>
