import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('src/features/auth/pages/LoginPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'items', component: () => import('pages/ItemsPage.vue') },
      { path: 'categories', component: () => import('pages/CategoriesPage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      {
        path: 'dashboard',
        component: () => import('src/features/dashboard/DashboardPage.vue'),
        meta: { roles: [] }, // all logged in users
      },
      {
        path: 'inventory',
        component: () => import('src/features/inventory/pages/ItemPage.vue'),
        meta: { roles: ['SUPERADMIN', 'ADMIN'] },
      },
      {
        path: 'supplier',
        component: () => import('src/features/supplier/pages/SupplierPage.vue'),
        meta: { roles: ['SUPERADMIN', 'ADMIN'] },
      },
      {
        path: 'loan',
        component: () => import('src/features/loan/LoanPage.vue'),
        meta: { roles: ['PEMINJAM'] },
      },
      {
        path: 'transaction/in',
        component: () => import('src/features/transaction/pages/StockInPage.vue'),
        meta: { roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'] },
      },
      {
        path: 'transaction/out',
        component: () => import('src/features/transaction/pages/StockOutPage.vue'),
        meta: { roles: ['SUPERADMIN', 'ADMIN', 'PETUGAS_GUDANG'] },
      },
      {
        path: 'report',
        component: () => import('src/features/report/ReportPage.vue'),
        meta: { roles: ['SUPERADMIN', 'ADMIN', 'PIMPINAN'] },
      },
      {
        path: 'change-password',
        component: () => import('src/features/auth/ChangePasswordPage.vue'),
      },
    ],
  },
  {
    path: '/403',
    component: () => import('pages/Error403.vue'),
  },
  {
    path: '/401',
    component: () => import('pages/Error401.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
