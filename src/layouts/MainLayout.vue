<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Sistem Informasi Inventaris</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Navigasi </q-item-label>

        <q-item
          v-for="link in linksList"
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
import { ref } from 'vue';

interface MenuItem {
  title: string;
  link: string;
  icon: string;
}

const linksList: MenuItem[] = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Data Barang',
    link: '/inventory',
    icon: 'inventory',
  },
  {
    title: 'Data Supplier',
    link: '/supplier',
    icon: 'business',
  },
  {
    title: 'Peminjaman',
    link: '/loan',
    icon: 'assignment',
  },
  {
    title: 'Barang Masuk',
    link: '/transaction/in',
    icon: 'input',
  },
  {
    title: 'Barang Keluar',
    link: '/transaction/out',
    icon: 'output',
  },
  {
    title: 'Laporan',
    link: '/report',
    icon: 'bar_chart',
  },
  {
    title: 'Ganti Password',
    link: '/change-password',
    icon: 'lock',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
