# Sistem Manajemen Tugas Mata Kuliah

Sistem manajemen dan pengumpulan tugas untuk mata kuliah:
- Pemrograman Web
- Komputasi Awan
- Desain dan Manajemen Jaringan Komputer

## Fitur

- 📝 Daftar tugas dengan deadline yang jelas
- 🌙 Mode gelap/terang yang dapat disesuaikan
- 📱 Responsif di semua perangkat (mobile, tablet, desktop)
- 📂 Pengumpulan link GitHub terintegrasi
- ☁️ Penyimpanan data otomatis ke Google Spreadsheet
- 📊 Pemisahan data pengumpulan berdasarkan mata kuliah

## Struktur Folder

```
/
├── index.html                 # Halaman utama
├── icon.png                   # Icon website
├── KomputasiAwan/             # Folder untuk mata kuliah Komputasi Awan
│   ├── index.html             # Halaman utama Komputasi Awan
│   ├── assets/
│   │   ├── style.css          # Stylesheet
│   │   └── script.js          # JavaScript
│   ├── Tugas1/                # Folder untuk Tugas 1
│   │   └── index.html
│   ├── Tugas2/
│   └── ...
│
├── PemrogramanWeb/            # Folder untuk mata kuliah Pemrograman Web
│   ├── index.html             # Halaman utama Pemrograman Web
│   ├── assets/
│   │   ├── style.css
│   │   └── script.js
│   ├── Tugas1/
│   └── ...
│
├── DMJK/                      # Folder untuk mata kuliah DMJK
│   ├── index.html             # Halaman utama DMJK
│   ├── assets/
│   │   ├── style.css
│   │   └── script.js
│   ├── Tugas1/
│   └── ...
```

## Instalasi

1. Clone repositori ini atau download sebagai ZIP
2. Upload file-file ke server web Anda
3. Pastikan struktur folder tetap terjaga

## Penggunaan

### Navigasi Tugas
- Klik pada kartu tugas untuk melihat detail tugas
- Status tugas ditandai dengan label warna:
  - **Hijau**: Aktif
  - **Oranye**: Akan Datang
  - **Merah**: Tutup

### Mengumpulkan Link GitHub

1. Setelah UTS, form pengumpulan link GitHub akan tersedia
2. Pilih Mata Kuliah dari dropdown (preset sesuai halaman)
3. Pilih nomor kelompok
4. Isi anggota kelompok dengan format `Nama - NIM` (satu per baris)
5. Masukkan link GitHub
6. Tambahkan keterangan jika diperlukan
7. Klik tombol "Kirim"

### Mengubah Mode Tema

- Klik ikon matahari/bulan di pojok kanan atas untuk beralih antara mode terang dan gelap

## Integrasi Google Spreadsheet

Sistem ini menggunakan Google Apps Script untuk menyimpan pengumpulan link GitHub ke Google Spreadsheet. Data akan disimpan dalam sheet yang berbeda berdasarkan mata kuliah yang dipilih.

### Struktur Data

Data yang disimpan ke spreadsheet meliputi:
- Timestamp
- Mata Kuliah
- Kelompok
- Anggota
- Link GitHub
- Keterangan
- Status

## Teknologi yang Digunakan

- HTML5 & CSS3
- JavaScript (ES6+)
- Google Apps Script
- Google Spreadsheet sebagai database
- Font Awesome untuk ikon
- AOS (Animate On Scroll) untuk animasi
- Poppins Font dari Google Fonts

## Pemeliharaan

### Menambahkan Tugas Baru

1. Duplikat blok `assignment-card` yang ada
2. Perbarui judul, status, dan deadline
3. Perbarui link ke halaman tugas

### Mengubah Deadline

Edit nilai pada elemen `assignment-deadline` di file `index.html`

### Mengubah Status Tugas

Ubah class status dari:
- `status-active` (Aktif)
- `status-upcoming` (Akan Datang)
- `status-closed` (Tutup)

---

&copy; 2025 - Sistem Manajemen Tugas - Dibuat untuk memudahkan pengelolaan tugas mata kuliah