<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Inventory Information System Dashboard</div>

    <div class="row q-gutter-md">
      <q-card class="col-12 col-md-4" @click="$router.push('/items')" style="cursor: pointer">
        <q-card-section>
          <div class="text-h6">Items Management</div>
          <div class="text-subtitle2">Manage inventory items, add, edit, delete</div>
        </q-card-section>
        <q-card-section>
          <q-icon name="inventory" size="4em" color="primary" />
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4" @click="$router.push('/categories')" style="cursor: pointer">
        <q-card-section>
          <div class="text-h6">Categories</div>
          <div class="text-subtitle2">Manage item categories</div>
        </q-card-section>
        <q-card-section>
          <q-icon name="category" size="4em" color="primary" />
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-4" @click="$router.push('/reports')" style="cursor: pointer">
        <q-card-section>
          <div class="text-h6">Reports</div>
          <div class="text-subtitle2">View inventory reports</div>
        </q-card-section>
        <q-card-section>
          <q-icon name="bar_chart" size="4em" color="primary" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const $router = useRouter();
</script>
