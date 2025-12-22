import { useAuthStore } from 'src/features/auth/store';

const rolePermissions: Record<string, string[]> = {
  SUPERADMIN: ['*'],
  ADMIN: ['loans.view', 'loans.approve'],
  PIMPINAN: ['loan.approve', 'loans.view'],
  USER: [],
  PEMINJAM: ['items.view', 'loans.create', 'loans.view'],
  PETUGAS_GUDANG: [],
};

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

export function hasPermission(permission: string): boolean {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated || !authStore.user) return false;
  if (authStore.user.role === 'SUPERADMIN') return true;
  return rolePermissions[authStore.user.role]?.includes(permission) || false;
}
