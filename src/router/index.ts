import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/features/auth/store';
import { hasRole, hasPermission } from 'src/shared/permissions';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    console.log('Router guard: to', to.path, 'from', from.path);
    console.log('Authenticated:', authStore.isAuthenticated, 'User:', authStore.user);

    // Load user from storage if not loaded
    if (!authStore.isAuthenticated) {
      authStore.loadUserFromStorage();
      console.log('Loaded from storage, now authenticated:', authStore.isAuthenticated);
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiredRoles = to.meta.roles as string[] | undefined;
    const requiredPermission = to.meta.permission as string | undefined;

    console.log(
      'Requires auth:',
      requiresAuth,
      'Required roles:',
      requiredRoles,
      'Required permission:',
      requiredPermission,
    );

    if (requiresAuth && !authStore.isAuthenticated) {
      console.log('Redirecting to /login');
      next('/login');
    } else if (requiredRoles && !hasRole(requiredRoles)) {
      console.log('Redirecting to /403');
      next('/403');
    } else if (requiredPermission && !hasPermission(requiredPermission)) {
      console.log('Redirecting to /403 due to permission');
      next('/403');
    } else {
      console.log('Allowing navigation');
      next();
    }
  });

  return Router;
});
