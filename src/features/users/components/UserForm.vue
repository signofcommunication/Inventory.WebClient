<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ isEdit ? 'Edit User' : 'Tambah User' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Name"
            outlined
            :rules="[(val) => (val && val.length > 0) || 'Name is required']"
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (val) => (val && val.length > 0) || 'Email is required',
              (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format',
            ]"
          />

          <q-input
            v-if="!isEdit"
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            :rules="[(val) => (val && val.length >= 6) || 'Password must be at least 6 characters']"
          />

          <q-select
            v-model="form.role"
            :options="roleOptions"
            label="Role"
            outlined
            :rules="[(val) => val || 'Role is required']"
          />

          <q-toggle v-model="form.isActive" label="Active" color="primary" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              @click="handleSubmit"
              :color="isEdit ? 'primary' : 'positive'"
              :label="isEdit ? 'Update' : 'Create'"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useUsersStore } from 'src/features/users/store';
import type { User, CreateUserPayload, UpdateUserPayload } from 'src/features/users/types';

const $q = useQuasar();
const usersStore = useUsersStore();

const props = defineProps<{
  modelValue: boolean;
  user?: User | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'user-saved': [];
}>();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.user);

const form = ref({
  name: '',
  email: '',
  password: '',
  role: '',
  isActive: true,
});

const loading = ref(false);

const roleOptions = ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG', 'PIMPINAN', 'PEMINJAM'];

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = {
        name: newUser.name,
        email: newUser.email,
        password: '',
        role: newUser.role,
        isActive: newUser.isActive,
      };
    } else {
      form.value = {
        name: '',
        email: '',
        password: '',
        role: '',
        isActive: true,
      };
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  console.log('Form data:', form.value); // Debug payload
  loading.value = true;
  try {
    if (isEdit.value && props.user) {
      const payload: UpdateUserPayload = {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      };
      await usersStore.updateUser(props.user.id, payload);
      $q.notify({
        type: 'positive',
        message: 'User berhasil diupdate',
      });
    } else {
      const payload: CreateUserPayload = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      };
      await usersStore.createUser(payload);
      $q.notify({
        type: 'positive',
        message: 'User berhasil dibuat',
      });
    }
    isVisible.value = false;
    emit('user-saved');
  } catch (error: unknown) {
    $q.notify({
      type: 'negative',
      message: (error as Error).message || 'Gagal menyimpan user',
    });
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  console.log('Form values before validate:', form.value);
  // Manual validation
  const errors = [];
  if (!form.value.name || form.value.name.length === 0) errors.push('Name is required');
  if (!form.value.email || form.value.email.length === 0) errors.push('Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    errors.push('Invalid email format');
  if (!isEdit.value && (!form.value.password || form.value.password.length < 6))
    errors.push('Password must be at least 6 characters');
  if (!form.value.role) errors.push('Role is required');

  console.log('Manual validation errors:', errors);
  if (errors.length === 0) {
    await onSubmit();
  } else {
    console.log('Form is invalid:', errors);
  }
};
</script>
