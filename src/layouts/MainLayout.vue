<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Inventory Information System </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          :on-click="() => (leftDrawerOpen = false)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    caption: 'Main dashboard',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Items',
    caption: 'Manage inventory items',
    icon: 'inventory',
    link: '/items',
  },
  {
    title: 'Categories',
    caption: 'Manage item categories',
    icon: 'category',
    link: '/categories',
  },
  {
    title: 'Reports',
    caption: 'View inventory reports',
    icon: 'bar_chart',
    link: '/reports',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
