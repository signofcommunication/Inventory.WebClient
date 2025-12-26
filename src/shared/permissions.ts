import { useAuthStore } from 'src/features/auth/store';

const rolePermissions: Record<string, string[]> = {
  superadmin: ['*'],
  admin: ['loans.view', 'loans.approve'],
  pimpinan: ['loans.approve', 'loans.view'],
  user: [],
  peminjam: ['items.view', 'loans.create', 'loans.view'],
  petugas_gudang: [],
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
  const userRole = authStore.user.role.toLowerCase();
  return roles.map((r) => r.toLowerCase()).includes(userRole);
}

export function hasPermission(permission: string): boolean {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated || !authStore.user) return false;
  if (authStore.user.role === 'SUPERADMIN') return true;
  const role = authStore.user.role.toLowerCase();
  const hasPerm = rolePermissions[role]?.includes(permission) || false;
  console.log(
    'hasPermission called with permission:',
    permission,
    'role:',
    authStore.user.role,
    'lowercased:',
    role,
    'hasPerm:',
    hasPerm,
  );
  return hasPerm;
}
