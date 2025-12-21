<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg text-center">
      <q-card-section>
        <div class="text-h4 text-negative">403 Forbidden</div>
        <div class="text-body1 q-mt-md">You do not have permission to access this page.</div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Go Back" @click="$router.go(-1)" />
        <q-btn flat label="Dashboard" to="/dashboard" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// 403 Forbidden page
</script>
