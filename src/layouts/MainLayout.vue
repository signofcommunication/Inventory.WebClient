<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>RAYA IMS (Inventory Management System)</q-toolbar-title>

        <q-space />

        <q-btn flat dense round icon="logout" aria-label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Navigasi </q-item-label>

        <template v-for="group in visibleGroups" :key="group.title">
          <q-item-label header>{{ group.title }}</q-item-label>
          <q-item
            v-for="link in group.items"
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
        </template>
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

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const authStore = useAuthStore();
const router = useRouter();

const menuGroups: MenuGroup[] = [
  {
    title: 'Manajemen',
    items: [
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
        title: 'Data Merek',
        link: '/brands',
        icon: 'branding_watermark',
        roles: ['SUPERADMIN', 'ADMIN'],
      },
    ],
  },
  {
    title: 'Transaksi',
    items: [
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
    ],
  },
  {
    title: 'Laporan',
    items: [
      {
        title: 'Reports',
        link: '/reports',
        icon: 'bar_chart',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'Stock',
        link: '/reports/stock',
        icon: 'inventory',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'Transactions',
        link: '/reports/transactions',
        icon: 'swap_horiz',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'Loans',
        link: '/reports/loans',
        icon: 'assignment',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'Suppliers',
        link: '/reports/suppliers',
        icon: 'business',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'Summary',
        link: '/reports/summary',
        icon: 'pie_chart',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
      {
        title: 'User Activity',
        link: '/reports/user-activity',
        icon: 'people',
        roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'],
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        title: 'Manajemen User',
        link: '/admin/users',
        icon: 'people',
        roles: ['SUPERADMIN'],
      },
      {
        title: 'Ganti Password',
        link: '/change-password',
        icon: 'lock',
      },
    ],
  },
];

const visibleGroups = computed(() =>
  menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || hasRole(item.roles)),
    }))
    .filter((group) => group.items.length > 0),
);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  authStore.logout();
  void router.push('/login');
}
</script>
