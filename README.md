# Sistem Informasi Inventaris

Sistem manajemen inventaris berbasis web yang dibangun dengan Quasar Vue.js untuk mengelola barang, kategori, peminjaman, transaksi masuk/keluar, dan laporan. Proyek ini merupakan bagian dari skripsi Stanley Tedjadinata.

## Fitur Utama

- **Autentikasi dan Otorisasi**: Sistem login dengan role-based access control (RBAC) untuk berbagai jenis pengguna.
- **Manajemen Kategori**: Tambah, edit, dan hapus kategori barang.
- **Manajemen Barang**: Kelola inventaris barang dengan foto, kode, nama, kategori, quantity, dan unit.
- **Manajemen Supplier**: Tambah dan kelola data supplier.
- **Transaksi Barang Masuk/Keluar**: Pencatatan transaksi stok dengan validasi.
- **Peminjaman Barang**: Sistem peminjaman dengan approval untuk role PIMPINAN.
- **Laporan**: Halaman laporan untuk analisis inventaris.
- **Dashboard**: Ringkasan data inventaris.

## Role dan Permission

- **SUPERADMIN**: Akses penuh ke semua fitur.
- **ADMIN**: Mengelola kategori, barang, supplier, transaksi, dan laporan.
- **PIMPINAN**: Menyetujui atau menolak peminjaman barang.
- **PEMINJAM**: Melihat dan membuat peminjaman barang.
- **PETUGAS_GUDANG**: Mengelola transaksi barang masuk dan keluar.

## Tech Stack

- **Frontend**: Quasar Framework (Vue 3), TypeScript
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Styling**: Quasar UI components
- **Build Tool**: Vite (via Quasar CLI)
- **Backend**: (Asumsi API eksternal, tidak termasuk dalam repo ini)

## Instalasi

### Prasyarat

- Node.js (versi 16+)
- Yarn atau npm

### Langkah Instalasi

1. Clone repository ini:

   ```bash
   git clone <url-repo>
   cd inventory
   ```

2. Install dependencies:

   ```bash
   yarn install
   # atau
   npm install
   ```

3. Konfigurasi environment (jika diperlukan, lihat `src/boot/axios.ts` untuk base URL API).

4. Jalankan aplikasi dalam mode development:
   ```bash
   quasar dev
   ```

Aplikasi akan berjalan di `http://localhost:9000` (atau port lain yang tersedia).

## Penggunaan

1. Login dengan kredensial yang sesuai role.
2. Navigasi melalui sidebar berdasarkan permission.
3. Untuk fitur peminjaman: PEMINJAM membuat request, PIMPINAN approve/reject.
4. Data disimpan dan diambil dari backend API.

## Struktur Proyek

```
src/
├── features/          # Fitur utama (auth, categories, inventory, dll.)
├── layouts/           # Layout utama dan auth
├── pages/             # Halaman utama
├── router/            # Routing dan guard
├── shared/            # Permission dan utilitas bersama
└── boot/              # Konfigurasi Quasar (axios, pinia)
```

## Development

### Lint dan Format

```bash
yarn lint
yarn format
```

### Build untuk Production

```bash
quasar build
```

### Konfigurasi

Lihat `quasar.config.ts` untuk konfigurasi build dan `src/boot/axios.ts` untuk API base URL.

## API Backend

Aplikasi ini mengandalkan backend API untuk data. Endpoint utama:

- `/auth/login` - Login
- `/items` - CRUD barang
- `/categories` - CRUD kategori
- `/suppliers` - CRUD supplier
- `/transactions` - Transaksi masuk/keluar
- `/loans` - Peminjaman
- `/reports` - Laporan

Pastikan backend mendukung include untuk relasi (e.g., `?include=kategori`).

## Contributing

1. Fork repo ini.
2. Buat branch fitur baru.
3. Commit perubahan.
4. Push dan buat Pull Request.

## Lisensi

Proyek ini untuk keperluan akademik (Skripsi). Hak cipta dilindungi.

## Kontak

Stanley Tedjadinata - [email atau info kontak jika ada]
