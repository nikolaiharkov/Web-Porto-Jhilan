# DESIGN: CMS portofolio film producer

## Arah visual

### Situs publik

- Pertahankan identitas yang ada: latar gelap, aksen cyan/magenta, tipografi display, foto/video sebagai fokus utama.
- Halaman publik tetap berkarakter sinematik dan editorial. Konten publik harus tetap dapat dibaca tanpa animasi.
- `/portofolio` menampilkan kartu proyek berbasis gambar, judul, kategori, dan tahun. Kategori menjadi filter.
- `/portofolio/[slug]` menampilkan ringkasan, kredit bila diisi, deskripsi lengkap, lalu galeri media sesuai urutan pengguna.
- `/artikel` menggunakan kartu editorial dengan thumbnail, kategori, tanggal, judul, dan ringkasan.
- `/artikel/[slug]` menggunakan lebar baca yang nyaman, hirarki heading jelas, gambar konten, tanggal, dan nama personal brand sebagai penulis.
- Homepage mempertahankan hero/About/kontak dan menampilkan proyek terbaru serta hingga tiga artikel terbaru. Bagian artikel tidak tampil ketika tidak ada artikel published.
- `/about` menampilkan foto profil dan isi profil lengkap. Foto kerja dipakai sebagai pendukung narasi/profil.
- Keadaan kosong katalog portofolio harus punya pesan sederhana dan jalur kontak atau navigasi, tanpa dummy project.

### Dashboard

- Dashboard memakai sistem visual netral dan konsisten; tidak meniru gaya gelap/neon halaman publik secara literal.
- Sidebar/navigasi dashboard: Ringkasan, Portofolio, Kategori Portofolio, Artikel, Kategori Artikel, Media, About, Pengaturan Situs, Pengguna.
- Navigasi responsif. Di layar kecil, navigasi menjadi menu yang mudah dijangkau tanpa menghalangi formulir.
- Gunakan label terlihat, status draft/published, pesan validasi dekat field, loading/success/error feedback, dialog konfirmasi untuk aksi destruktif, focus ring terlihat, navigasi keyboard, dan target sentuh yang memadai.
- Hormati `prefers-reduced-motion`. Gunakan transisi singkat hanya untuk memberi feedback.

## Alur CMS

### Login dan dashboard

1. Pengguna membuka `/login`, mengisi username/password.
2. Server memverifikasi bcrypt hash, membuat sesi terenkripsi, lalu mengarahkan ke `/dashboard`.
3. Jika password akun adalah `admin`, tampilkan peringatan yang dapat ditutup/diabaikan. Pengguna tetap dapat menggunakan dashboard.
4. Logout menghapus cookie sesi.

### Membuat proyek

1. Dari Portofolio, pilih Tambah Proyek.
2. Isi judul; slug disarankan dari judul dan harus unik. Pilih satu kategori.
3. Isi ringkasan pendek dan deskripsi lengkap pada editor rich-text.
4. Tambahkan kredit opsional sebagai pasangan label/nilai bebas.
5. Tambah media dengan multiple upload atau pilih dari Media Library. Video bisa file lokal atau tautan YouTube.
6. Susun urutan media; media pertama yang dapat dijadikan gambar menentukan kartu/featured image sesuai aturan thumbnail.
7. Pilih Simpan Draft atau Publikasikan.
8. Tampilkan hasil simpan dan tautan preview/publikasi sesuai status.

### Membuat artikel

1. Dari Artikel, pilih Tambah Artikel.
2. Isi judul, slug, ringkasan, kategori opsional, dan isi TinyMCE.
3. Featured image mengikuti media pertama yang sesuai secara default; pengguna dapat memilih media lain dari Media Library.
4. Media di dalam editor diunggah atau dipilih dari Media Library.
5. Isi SEO title/description jika diperlukan; default berasal dari judul/ringkasan.
6. Pilih Simpan Draft atau Publikasikan.

### Media Library dan penghapusan

- Pustaka menampilkan media visual dengan nama, tipe, tanggal, dan kontrol pemilihan/hapus.
- Upload menerima banyak file melalui satu alur. Form proyek menghubungkan file/YouTube embed ke proyek; editor artikel menyisipkan gambar.
- Saat menghapus media, query relasi dipakai untuk menyusun daftar URL artikel/proyek yang terpengaruh. SweetAlert meminta konfirmasi dan menyebut dampak.
- Setelah konfirmasi, hapus file dan/atau metadata media sesuai rancangan persistence final. Konten terkait tetap tersimpan dan renderer menampilkan placeholder pada referensi yang hilang.

### Pengelolaan kategori dan akun

- Kategori portofolio: CRUD; penghapusan ditolak bila proyek masih terhubung.
- Kategori artikel: CRUD; penghapusan melepas kategori dari artikel, artikel tetap ada.
- Akun: daftar, tambah, ubah password, hapus. Form tambah menerima password manual atau generator 8 karakter yang terlihat dan dapat disalin. Validasi minimal 8 karakter berlaku untuk password baru.
- Tolak penghapusan akun username `admin` dan akun terakhir. Semua pengguna terautentikasi dapat melakukan operasi ini.

### About dan pengaturan situs

- Form About mengelola ringkasan homepage, konten panjang TinyMCE, dan foto profil yang dipilih dari pustaka.
- Form Pengaturan Situs mengelola hero, nama personal brand, kontak, dan daftar sosial dinamis berisi nama serta URL.
- Tidak ada editor layout, tema, warna, atau posisi section.

## Model konten tingkat produk

- `User`: username, bcrypt password hash, penanda akun seed/admin, timestamps.
- `PortfolioCategory`: nama, slug.
- `Project`: title, slug, category, summary, rich-text description, optional credits, status, publishedAt, timestamps.
- `ProjectMedia`: referensi Media atau URL YouTube, tipe, urutan, title/alt yang diperlukan.
- `ArticleCategory`: nama, slug.
- `Article`: title, slug, excerpt, rich-text content, optional category, status, featured media, SEO title/description, publishedAt, updatedAt.
- `Media`: path relatif, tipe/MIME, nama asli, metadata yang diperlukan.
- `SiteSettings`: nama personal brand, hero, About short/full, profile media, kontak, social links.

Ini model konseptual untuk menyelaraskan produk, bukan migration DDL final. Relasi media yang dipakai banyak konten perlu mempertahankan identitas file tunggal agar delete-impact dapat dihitung.

## Arsitektur aplikasi

- Pertahankan satu aplikasi Next.js App Router.
- Public Server Components membaca konten published melalui repository/service SQLite; jangan kirim draft ke renderer publik.
- Operasi CMS dilindungi sesi di server. Validasi input pada trust boundary; editor HTML disanitasi sebelum disimpan atau dirender.
- `better-sqlite3` menjadi satu koneksi lokal per proses; aktifkan foreign-key constraints dan WAL setelah diverifikasi di target runtime.
- Database dan upload berada di path runtime yang dapat dikonfigurasi lewat environment non-secret/path env dan dipasang ke volume Portainer. Rahasia tetap di `.env`.
- File upload menggunakan nama aman yang dibuat server, bukan path dari nama file pengguna. Jangan menyimpan upload di filesystem container ephemeral atau mengandalkan `/public` bila folder itu tidak persisten.
- YouTube embed menerima URL video yang divalidasi dan diubah ke URL embed yang aman; jangan menerima arbitrary iframe HTML dari user.
- Penghapusan media memerlukan lookup relasi sebelum delete dan operasi filesystem/database yang mencegah referensi rusak tanpa pemberitahuan.
- Revalidasi cache/rute setelah publish/update/delete agar publik melihat perubahan tanpa stale content.
- Docker/Portainer harus membangun native addon dan memberi permission tulis ke volume DB/media.

## Error handling dan keamanan UX

- Login gagal memberi pesan generik, tidak menyebut apakah username terdaftar.
- Route CMS tanpa sesi ditolak/diarahkan ke login.
- Form menampilkan validasi di dekat field, menjaga input saat error, dan memberi status saat simpan.
- Delete media memperlihatkan daftar URL terdampak sebelum konfirmasi.
- Bila upload gagal atau disk penuh, tampilkan error dan jangan menghapus file/record yang sudah tersimpan.
- Sanitasi HTML dan validasi URL/media diperlukan walau konten dibuat pengguna CMS.

## Tidak termasuk versi awal

Tidak ada analytics, multi-role, workflow approval, layout builder, tema yang dapat diubah, featured projects, drag-sort katalog, komentar, atau storage eksternal. Ponytail: tambahkan kebutuhan ini hanya saat ada alur nyata yang membutuhkannya.
