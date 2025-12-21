import { useAuthStore } from 'src/features/auth/store';

export function hasRole(roles: string[]): boolean {
  const authStore = useAuthStore();
  console.log(
    'hasRole called with roles:',
    roles,
    'auth:',
    authStore.isAuthenticated,
    'user:',
    authStore.user,
  );
  if (!authStore.isAuthenticated || !authStore.user) return false;
  if (authStore.user.role === 'SUPERADMIN') return true;
  if (roles.length === 0) return true; // all authenticated users
  return roles.includes(authStore.user.role);
}
