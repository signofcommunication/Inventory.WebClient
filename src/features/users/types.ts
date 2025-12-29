export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'PETUGAS_GUDANG' | 'PIMPINAN' | 'PEMINJAM';
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: string;
}
