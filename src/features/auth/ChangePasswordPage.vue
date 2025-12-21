<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Ganti Password</div>
    <div class="text-body1 q-mb-xl">Change user password</div>

    <q-card style="max-width: 400px">
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input label="Old Password" type="password" outlined />
          <q-input label="New Password" type="password" outlined />
          <q-input label="Confirm Password" type="password" outlined />
          <q-btn label="Change Password" color="primary" type="submit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// Placeholder for change password form
</script>
