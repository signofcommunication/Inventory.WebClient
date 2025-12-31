<template>
  <q-table
    :rows="usersStore.users"
    :columns="columns"
    :loading="usersStore.loading"
    row-key="id"
    flat
    bordered
  >
    <template #body-cell-role="props">
      <q-td :props="props">
        <q-badge :color="getRoleColor(props.value)" :label="props.value" />
      </q-td>
    </template>

    <template #body-cell-isActive="props">
      <q-td :props="props">
        <q-badge
          :color="props.value ? 'green' : 'red'"
          :label="props.value ? 'Active' : 'Inactive'"
        />
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round icon="edit" color="primary" @click="editUser(props.row)" />
        <q-btn
          flat
          round
          :icon="props.row.isActive ? 'block' : 'check_circle'"
          :color="props.row.isActive ? 'negative' : 'positive'"
          @click="toggleStatus(props.row)"
          :disable="isCurrentUser(props.row)"
        />
        <q-btn
          flat
          round
          icon="delete"
          color="negative"
          @click="$emit('delete-user', props.row)"
          :disable="isCurrentUser(props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUsersStore } from 'src/features/users/store';
import { useAuthStore } from 'src/features/auth/store';
import type { User } from 'src/features/users/types';

const $q = useQuasar();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const emit = defineEmits<{
  'edit-user': [user: User];
  'delete-user': [user: User];
}>();

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'role', label: 'Role', field: 'role', align: 'left' as const },
  { name: 'isActive', label: 'Status', field: 'isActive', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: '', align: 'center' as const },
];

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    SUPERADMIN: 'red',
    ADMIN: 'orange',
    PETUGAS_GUDANG: 'blue',
    PIMPINAN: 'purple',
    PEMINJAM: 'green',
  };
  return colors[role] || 'grey';
};

const isCurrentUser = (user: User) => {
  return authStore.user?.id === user.id;
};

const editUser = (user: User) => {
  emit('edit-user', user);
};

const toggleStatus = async (user: User) => {
  try {
    await usersStore.toggleUserStatus(user.id, !user.isActive);
    $q.notify({
      type: 'positive',
      message: `User ${user.isActive ? 'dinonaktifkan' : 'diaktifkan'}`,
    });
  } catch (error: unknown) {
    $q.notify({
      type: 'negative',
      message: (error as Error).message || 'Gagal mengubah status user',
    });
  }
};
</script>
