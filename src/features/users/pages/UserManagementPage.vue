<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4>Manajemen User</h4>
      <q-btn color="primary" icon="add" label="Tambah User" @click="showUserForm = true" />
    </div>

    <UserTable @edit-user="editUser" @delete-user="confirmDeleteUser" />

    <UserForm v-model="showUserForm" :user="selectedUser" @user-saved="onUserSaved" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import UserTable from 'src/features/users/components/UserTable.vue';
import UserForm from 'src/features/users/components/UserForm.vue';
import { useUsersStore } from 'src/features/users/store';
import type { User } from 'src/features/users/types';

const $q = useQuasar();
const usersStore = useUsersStore();

const showUserForm = ref(false);
const selectedUser = ref<User | null>(null);

onMounted(() => {
  void usersStore.fetchUsers();
});

const editUser = (user: User) => {
  selectedUser.value = user;
  showUserForm.value = true;
};

const confirmDeleteUser = async (user: User) => {
  const confirm = await ($q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus user "${user.name}"?`,
    cancel: true,
    persistent: true,
  }) as Promise<boolean>);

  if (confirm) {
    try {
      await usersStore.deleteUser(user.id);
      $q.notify({
        type: 'positive',
        message: 'User berhasil dihapus',
      });
    } catch (error: unknown) {
      $q.notify({
        type: 'negative',
        message: (error as Error).message || 'Gagal menghapus user',
      });
    }
  }
};

const onUserSaved = () => {
  selectedUser.value = null;
  void usersStore.fetchUsers();
};
</script>
