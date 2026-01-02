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
import { Dialog } from 'quasar';

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
    title: 'Management',
    items: [
      {
        title: 'Dashboard',
        link: '/dashboard',
        icon: 'dashboard',
        roles: [], // all
      },
      {
        title: 'Items Categories',
        link: '/categories',
        icon: 'category',
        roles: ['SUPERADMIN', 'ADMIN'],
      },
      {
        title: 'Data Items',
        link: '/inventory',
        icon: 'inventory',
        roles: ['SUPERADMIN', 'ADMIN'],
      },
      {
        title: 'Data Suppliers',
        link: '/supplier',
        icon: 'business',
        roles: ['SUPERADMIN', 'ADMIN'],
      },
      {
        title: 'Data Brands',
        link: '/brands',
        icon: 'branding_watermark',
        roles: ['SUPERADMIN', 'ADMIN'],
      },
    ],
  },
  {
    title: 'Transactions',
    items: [
      {
        title: 'Loan',
        link: '/loan',
        icon: 'assignment',
        roles: ['PEMINJAM'],
      },
      {
        title: 'Loan Approval',
        link: '/loan/approval',
        icon: 'check_circle',
        roles: ['PIMPINAN'],
      },
      {
        title: 'Transaction In',
        link: '/transaction/in',
        icon: 'input',
        roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'],
      },
      {
        title: 'Transaction Out',
        link: '/transaction/out',
        icon: 'output',
        roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'],
      },
    ],
  },
  {
    title: 'Reports',
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
        title: 'User Management',
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
  Dialog.create({
    title: 'Confirm Logout?',
    message: 'Are you sure want logout?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authStore.logout();
    void router.push('/login');
  });
}
</script>
