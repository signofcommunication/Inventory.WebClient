import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'items', component: () => import('pages/ItemsPage.vue') },
      { path: 'categories', component: () => import('pages/CategoriesPage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      {
        path: 'dashboard',
        component: () => import('src/features/dashboard/DashboardPage.vue'),
      },
      { path: 'inventory', component: () => import('src/features/inventory/pages/ItemPage.vue') },
      { path: 'supplier', component: () => import('src/features/supplier/pages/SupplierPage.vue') },
      { path: 'loan', component: () => import('src/features/loan/LoanPage.vue') },
      {
        path: 'transaction/in',
        component: () => import('src/features/transaction/pages/StockInPage.vue'),
      },
      {
        path: 'transaction/out',
        component: () => import('src/features/transaction/pages/StockOutPage.vue'),
      },
      { path: 'report', component: () => import('src/features/report/ReportPage.vue') },
      {
        path: 'change-password',
        component: () => import('src/features/auth/ChangePasswordPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
