<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Sistem Informasi Inventaris</q-toolbar-title>

        <q-space />

        <q-btn flat dense round icon="logout" aria-label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Navigasi </q-item-label>

        <q-item
          v-for="link in visibleLinks"
          :key="link.title"
          clickable
          tag="router-link"
          :to="link.link"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/features/auth/store';
import { hasRole } from 'src/shared/permissions';

interface MenuItem {
  title: string;
  link: string;
  icon: string;
  roles?: string[];
}

const authStore = useAuthStore();
const router = useRouter();

const linksList: MenuItem[] = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: 'dashboard',
    roles: [], // all
  },
  {
    title: 'Kategori Barang',
    link: '/categories',
    icon: 'category',
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Data Barang',
    link: '/inventory',
    icon: 'inventory',
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Data Supplier',
    link: '/supplier',
    icon: 'business',
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    title: 'Peminjaman',
    link: '/loan',
    icon: 'assignment',
    roles: ['PEMINJAM'],
  },
  {
    title: 'Persetujuan Peminjaman',
    link: '/loan/approval',
    icon: 'check_circle',
    roles: ['PIMPINAN'],
  },
  {
    title: 'Barang Masuk',
    link: '/transaction/in',
    icon: 'input',
    roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'],
  },
  {
    title: 'Barang Keluar',
    link: '/transaction/out',
    icon: 'output',
    roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'],
  },
  {
    title: 'Laporan',
    link: '/report',
    icon: 'bar_chart',
    roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
  },
  {
    title: 'Ganti Password',
    link: '/change-password',
    icon: 'lock',
  },
];

const visibleLinks = computed(() => linksList.filter((link) => !link.roles || hasRole(link.roles)));

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  authStore.logout();
  void router.push('/login');
}
</script>
