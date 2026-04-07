# Website UMKM Lokal

Platform digital sederhana untuk UMKM lokal mempromosikan produk dan menghitung Harga Pokok Produksi (HPP).

## Fitur Utama

### 🔐 Login & Registrasi User
- Sistem registrasi user baru
- Validasi username dan email unik
- Password minimal 6 karakter
- Multi-role authentication (admin/user)
- Panel admin dengan dashboard statistik
- Manajemen produk (tambah, hapus)
- Proteksi akses berdasarkan role

### 🏠 Halaman Beranda
- Tampilan modern dan responsive
- Banner "Dukung UMKM Lokal"
- Produk rekomendasi
- Animasi ringan dan interaktif

### 📦 Daftar Produk
- Grid layout dengan card design
- Fitur pencarian real-time
- Filter berdasarkan kategori (makanan, minuman, fashion, kerajinan, elektronik)
- Sorting harga (termurah/termahal) dan nama (A-Z)
- Wishlist dengan ikon hati

### 📄 Detail Produk
- Gambar produk besar
- Informasi lengkap produk
- Tombol hubungi penjual (integrasi WhatsApp)
- Navigasi yang mudah

### 🧮 Kalkulator HPP
- Input biaya produksi (bahan baku, tenaga kerja, operasional)
- Perhitungan otomatis HPP per produk
- Rekomendasi harga jual dengan margin keuntungan
- Analisis bisnis
- Format Rupiah yang user-friendly

### ℹ️ Tentang Kami
- Penjelasan misi platform
- Keunggulan fitur
- Informasi kontak

## Fitur Tambahan

### 🌙 Dark Mode
- Toggle dark/light mode
- Preferensi tersimpan di localStorage
- Transisi yang halus

### ❤️ Wishlist
- Tambah/hapus produk favorit
- Counter jumlah wishlist
- Data persisten

### 🔔 Notifikasi
- Feedback untuk setiap aksi
- Animasi slide in/out
- Auto-dismiss

## Teknologi

- **HTML5** - Struktur semantik
- **CSS3** - Styling modern dengan Flexbox/Grid
- **JavaScript Vanilla** - Logika aplikasi tanpa framework
- **Font Awesome** - Ikon profesional
- **Google Fonts** - Typography Poppins

## Cara Penggunaan

### Langkah 1: Registrasi atau Login

#### **Opsi 1: Daftar User Baru**
1. **Buka website** di browser modern
2. **Klik "Login"** → **"Daftar di sini"**
3. **Isi form registrasi**:
   - Username (unik)
   - Email (unik)
   - Password (minimal 6 karakter)
   - Konfirmasi password
   - Nama lengkap
4. **Klik "Daftar Sekarang"**
5. **Login** dengan kredensial baru

#### **Opsi 2: Login Langsung**
1. **Gunakan akun default**:
   - Admin: `admin` / `admin123`
   - User: `user` / `user123`

### Akses Langsung via URL:
- **Registrasi**: `website.com/register` (publik)
- **Admin Panel**: `website.com/admin` (hanya admin)
- **User Dashboard**: `website.com/user` (user dan admin)
- **Home**: `website.com/` (publik)

### Setelah Login:
1. **Lihat produk** di halaman Daftar Produk
2. **Gunakan filter** untuk mencari produk spesifik
3. **Hitung HPP** menggunakan Kalkulator HPP
4. **Hubungi penjual** via WhatsApp dari detail produk
5. **Akses Panel Admin** untuk manajemen produk

### Fitur Admin:
1. **Dashboard statistik** - lihat total produk dan wishlist
2. **Tambah produk** melalui form di panel admin
3. **Hapus produk** dari tabel manajemen
4. **Logout** saat selesai

### Catatan:
- **Login wajib** untuk mengakses semua fitur kecuali landing page
- Kredensial default: `admin` / `admin123`
- Session tersimpan selama browser tidak ditutup

## Login Multi-Role

### 🔐 Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Akses**: Panel Admin, tambah/hapus produk, dashboard lengkap
- **URL**: `/admin`

### 👤 User Login
- **Username**: `user`
- **Password**: `user123`
- **Akses**: Lihat produk, kalkulator HPP, dashboard user
- **URL**: `/user`

### 🔒 Keamanan:
- Kredensial tidak ditampilkan di login page
- Hubungi administrator untuk mendapatkan akses
- Proteksi URL-based routing
- Session management yang aman

### Perbedaan Akses:
| Fitur | Admin | User |
|-------|-------|------|
| Lihat Produk | ✅ | ✅ |
| Kalkulator HPP | ✅ | ✅ |
| Dashboard | ✅ (Admin) | ✅ (User) |
| Tambah Produk | ✅ | ❌ |
| Hapus Produk | ✅ | ❌ |
| Panel Admin | ✅ | ❌ |

*Catatan: Ini adalah kredensial default untuk demonstrasi. Dalam produksi, gunakan sistem autentikasi yang lebih aman.*

## Struktur File

```
pkk/
├── index.html          # Halaman utama
├── styles.css          # Styling dan responsive design
├── script.js           # Logika JavaScript
└── README.md          # Dokumentasi
```

## Responsive Design

Website ini fully responsive:
- **Desktop** (>768px) - Layout penuh dengan grid
- **Tablet** (768px-1024px) - Layout adaptif
- **Mobile** (<768px) - Single column dengan hamburger menu

## Data Storage

- **Produk** - localStorage (`products`)
- **Wishlist** - localStorage (`wishlist`)
- **Dark Mode** - localStorage (`darkMode`)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Kalkulator HPP - Rumus

```
Total Biaya = Bahan Baku + Tenaga Kerja + Biaya Operasional
HPP per Produk = Total Biaya / Jumlah Produksi
Harga Jual = HPP + (HPP × Margin Keuntungan)
```

## Contoh Produk Awal

Website dilengkapi dengan 4 contoh produk:
1. Keripik Pisang Premium (Makanan)
2. Madu Murni Hutan (Minuman)
3. Tas Kulit Handmade (Fashion)
4. Kerajinan Anyaman Bambu (Kerajinan)

## Pengembangan

Kode dirancang untuk:
- Mudah dipahami pemula
- Struktur yang terorganisir
- Komentar yang jelas
- Best practices JavaScript

## Lisensi

Open source untuk pembelajaran dan pengembangan UMKM lokal Indonesia.

---

*Dibuat dengan ❤️ untuk mendukung UMKM Indonesia*
