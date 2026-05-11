# Offline Note App

## Informasi Mahasiswa

- Nama : Rafa Umar Abdus Syakur
- NIM : 2410501045
- Kelas : B

## Deskripsi Aplikasi

Aplikasi ini merupakan aplikasi note taking berbasis mobile yang dikembangkan menggunakan React Native. Aplikasi dirancang menggunakan konsep offline-first architecture sehingga pengguna tetap dapat mengakses dan mengelola catatan meskipun tanpa koneksi internet.

## Fitur Utama

- **CRUD Notes**: User dapat membuat, melihat, mengedit, dan menghapus catatan. Seluruh catatan disimpan secara lokal menggunakan SQLite.
- **Offline-First Architecture**: Aplikasi tetap berjalan tanpa koneksi internet karena seluruh data disimpan di database lokal menggunakan SQLite.
- **Search Notes**: Fitur pencarian menggunakan query SQL `LIKE` untuk mencari judul atau isi catatan.
- **Theme Preferences**: User dapat mengubah tema aplikasi menjadi terang/gelap/mengikuti tema sistem. Preferensi tersebut disimpan menggunakan `react-native-mmkv`
- **Font Size Settings**: User dapat memperbesar atau memperkecil ukuran font catatan sesuai preferensi.
- **Card Theme Customization**: Aplikasi menyediakan beberapa pilihan warna card dengan kombinasi border dan background transparan untuk meningkatkan tampilan visual.
- **Undo & Redo Editor**: Saat menulis atau mengedit catatan, user dapat undo/redo tulisan. Fitur ini menggunakan history stack dengan debounce.
- **Offline Banner**: Aplikasi menampilkan indikator offline/online untuk memberi informasi status koneksi jaringan kepada user.
- **MMKV Sync Queue**: Aplikasi memiliki implementasi sync queue sederhana untuk menyimpan antrian sinkronisasi ketika perangkat sedang offline.

## Screenshot

### Home Screen

<p align="center">
   <img src="https://github.com/user-attachments/assets/04078c14-f9b9-472c-ba5b-287d0068089b" alt="home-light" width="250" />
  <img src="https://github.com/user-attachments/assets/e8abf623-3e8d-46e0-932a-7a1b6bb5c89b" alt="home-dark" width="250" />
</p>

### Create Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/5a8bb598-1c5e-41bb-9cf4-7424dec7a76a" alt="create-light" width="250" />
  <img src="https://github.com/user-attachments/assets/b8cb0331-d088-4190-b505-65000d8ee178" alt="create-dark" width="250" />
</p>

### Edit Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/b71e5715-3318-4589-af75-2e0298e32ee2" alt="offline-light" width="250" />
  <img src="https://github.com/user-attachments/assets/12547bc2-407b-4040-9030-2d671dc622a4" alt="offline-dark" width="250" />
</p>

### Sync Mode (Offline)

<p align="center">
  <img src="https://github.com/user-attachments/assets/c08e3b7c-cb6b-4930-9353-e6558f775abd" alt="offline-light" width="250" />
  <img src="https://github.com/user-attachments/assets/367288f7-84a1-4a6f-9836-b1b15509159e" alt="offline-dark" width="250" />
</p>

### Sync Mode (Online)

<p align="center">
  <img src="https://github.com/user-attachments/assets/79de3cb1-8446-42c0-a17a-0e4b97d33697" alt="online-light" width="250" />
  <img src="https://github.com/user-attachments/assets/657f7fbd-e764-4163-b893-e5f6be36f9ec" alt="online-dark" width="250" />
</p>

### Search Mode (Card Theme + Font Sizing)

<p align="center">
  <img src="https://github.com/user-attachments/assets/f563258a-594d-4680-9c0e-0c5c5448d661" alt="search-light" width="250" />
  <img src="https://github.com/user-attachments/assets/f02c62eb-ac96-4837-921c-58dfed0db9a0" alt="search-dark" width="250" />
</p>

## Cara Menjalankan

1. Clone the repository:
   ```bash
   git clone https://github.com/Eclipse-02/offline-note-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build native project (MMKV V4 requirements):
   ```bash
   npx expo prebuild
   ```
3. Run project on native environment:
   ```bash
   npx expo run:android --device
   ```
