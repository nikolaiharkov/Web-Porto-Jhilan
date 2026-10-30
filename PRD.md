# PRD: CMS portofolio film producer

## Ringkasan

Menambahkan CMS multi-akun ke website portofolio pribadi seorang film producer. Pengguna mengelola proyek, artikel, media, halaman About, informasi beranda, kontak, tautan sosial, dan akun melalui `/dashboard`. Website publik mempertahankan identitas visual sinematik yang ada. Proyek dan artikel awal tidak dimigrasikan; konten profil dan identitas situs tetap dipertahankan dan dapat diedit.

## Tujuan

- Mengelola proyek foto/video dan artikel tanpa mengubah source code.
- Menampilkan proyek dan artikel yang sudah dipublikasikan pada URL stabil dan dapat diindeks.
- Memberi beberapa akun CMS akses yang setara.
- Menjaga file database dan media tetap ada setelah container dideploy ulang.

## Bukan tujuan

- Multi-role/permission, analytics, komentar, workflow approval, multi-language.
- CMS untuk mengubah layout atau tema situs.
- Pengurutan manual katalog proyek/artikel, proyek unggulan, migrasi konten portofolio lama, batas ukuran upload, atau layanan object storage.
- Redirect URL lama `/project/[id]`.

## Pengguna

- Pengunjung publik: mencari karya, membaca artikel, mengetahui profil dan cara menghubungi pemilik situs.
- Pengguna CMS: akun setara yang sudah login dan mengelola konten serta akun.

## Rute

| Rute | Fungsi | Akses |
| --- | --- | --- |
| `/` | Beranda, hero, ringkasan About, proyek terbaru, artikel terbaru, kontak | Publik |
| `/about` | Profil lengkap | Publik |
| `/portofolio` | Katalog proyek terbit, filter kategori | Publik |
| `/portofolio/[slug]` | Detail proyek dan media | Publik, hanya published |
| `/artikel` | Katalog artikel terbit, filter kategori | Publik |
| `/artikel/[slug]` | Artikel lengkap | Publik, hanya published |
| `/login` | Login CMS | Publik |
| `/dashboard` | Ringkasan CMS | Sesi valid |
| `/dashboard/*` | CRUD konten, kategori, media, pengaturan dan akun | Sesi valid |

## Kebutuhan fungsional

### Portofolio

- CRUD proyek dengan judul, slug, satu kategori, ringkasan teks, deskripsi lengkap rich-text, status draft/published, tanggal publikasi, serta kredit/peran produksi opsional yang diisi bebas.
- Proyek berisi urutan media campuran: foto upload, video file lokal, atau video YouTube embed. Satu proyek dapat menggunakan banyak media.
- Pengguna bisa mengubah urutan media secara manual. Katalog diurutkan berdasarkan tanggal publikasi terbaru; tidak ada proyek unggulan.
- Featured image ditentukan dari media pertama yang dapat dijadikan gambar. YouTube menyediakan thumbnail dari video. Jika kandidat pertama video lokal, gunakan foto pertama pada proyek. Jika tidak ada foto yang sesuai, tampilkan placeholder.
- Kategori portofolio dibuat dan dikelola pengguna. Kategori yang masih memiliki proyek tidak dapat dihapus.

### Artikel

- CRUD artikel dengan judul, slug, ringkasan, isi TinyMCE, kategori opsional, status, tanggal publikasi, dan metadata SEO opsional.
- Artikel dapat disimpan sebagai draft atau langsung diterbitkan.
- Katalog diurutkan berdasarkan tanggal publikasi terbaru. Penulis publik adalah nama personal brand, bukan nama akun CMS.
- Featured image artikel dipilih dari media pertama yang sesuai secara default; pengguna dapat memilih media lain dari Media Library.
- Jika kategori artikel dihapus, artikel tetap ada dengan kategori kosong.
- Beranda menampilkan paling banyak tiga artikel terbaru yang published. Jika tidak ada, bagian ini tidak ditampilkan.

### Media

- Pustaka media terpusat untuk melihat, mengunggah banyak file, dan memilih ulang media.
- Foto dapat diunggah multiple. Video dapat berupa file lokal atau URL YouTube; keduanya mendukung multiple item pada proyek.
- TinyMCE dan formulir proyek dapat mengunggah media atau memilih media yang sudah ada.
- Penghapusan media memerlukan konfirmasi SweetAlert yang menampilkan URL halaman artikel/proyek yang terdampak. Konten tetap ada; referensi yang hilang menghasilkan placeholder.
- Tidak ada batas ukuran upload yang ditetapkan dalam scope produk. Kapasitas disk VPS menjadi risiko operasional.

### Akun dan autentikasi

- Login/logout, penggantian password sendiri, pembuatan akun, penggantian password akun, dan penghapusan akun dari dashboard.
- Semua akun setara. Tidak ada registrasi publik.
- Akun awal dibuat satu kali ketika database belum memiliki pengguna. Username dan password bootstrap berasal dari `.env`; password awal bernilai `admin` pada konfigurasi deployment, disimpan sebagai hash bcrypt. Nilai rahasia tidak boleh ditanam dalam kode atau dokumen.
- Jika password awal masih `admin`, dashboard menampilkan peringatan untuk menggantinya. Peringatan dapat diabaikan dan tidak mengunci dashboard.
- Password baru minimal 8 karakter. Form tambah akun menerima password manual atau tombol pembuat password acak 8 karakter yang dapat disalin. Akun dibuat setelah submit.
- Akun bernama `admin` tidak bisa dihapus; akun terakhir juga tidak bisa dihapus.
- Rahasia sesi dan rahasia/kredensial autentikasi disediakan melalui `.env`.

### About dan pengaturan situs

- Ringkasan About untuk beranda terpisah dari isi lengkap halaman `/about`.
- Isi lengkap About dapat diedit dengan TinyMCE. Foto profil dipilih dari Media Library.
- Foto profil di folder input `foto/foto profil/` digunakan untuk foto profil, identitas/favikon, dan featured image personal. Foto lain langsung di bawah `foto/` digunakan sebagai foto pendukung saat bekerja. File yang ada saat ini: `Me in PKBM 2026-1.jpg.jpeg` di folder profil, serta `DOP Antu Banyu-6.jpg.jpeg`, `DOP Antu Banyu-4.jpg.jpeg`, `DOP Antu Banyu-1.jpg.jpeg`, dan `Chin v4.png` di luar folder profil. Lokasi publik/runtime dan ekstensi akhir ditetapkan saat implementasi setelah meninjau pengelolaan aset Next.js.
- Pengguna dapat mengubah teks hero, ringkasan About, nama personal brand, kontak, dan tautan sosial.
- Platform sosial fleksibel: pengguna mengisi nama platform dan URL.
- Tema dan layout tidak dapat diubah melalui CMS.

## Aturan deployment dan data

- Satu aplikasi Next.js self-hosted di VPS melalui Portainer.
- SQLite memakai `better-sqlite3`; file database dan upload berada pada storage persisten yang dipetakan ke container.
- Tidak memakai layanan eksternal/database server atau object storage.
- SQLite WAL dapat melayani pembaca bersamaan, tetapi hanya satu writer pada satu waktu. Deployment ditujukan untuk satu instance pada host yang sama.
- Backup operasional harus mencakup database dan semua media. Jangan menyalin hanya file database ketika WAL aktif tanpa strategi backup SQLite yang aman.
- Proyek, artikel, dan media portofolio lama tidak dimigrasikan dan harus dibersihkan dari website. Konten profil/hero/identitas tetap ada. Penghapusan aset konkret harus dibatasi pada berkas yang teridentifikasi sebagai konten portofolio lama; foto baru tidak boleh tertimpa.

## Kriteria penerimaan

- Draft tidak muncul pada rute publik atau sitemap; published tampil pada katalog dan halaman detail.
- Proyek mendukung media campuran, thumbnail sesuai fallback yang ditentukan, dan penyusunan ulang media.
- Artikel/proyek dan gambar yang dipilih dari Media Library tampil pada halaman publik.
- Hapus media memperingatkan halaman terdampak, lalu halaman tetap render dengan placeholder.
- Kategori proyek aktif tidak dapat dihapus; penghapusan kategori artikel melepas relasi tanpa menghapus artikel.
- Pengguna yang login dapat mengelola akun sesuai batasan akun `admin` dan akun terakhir.
- Password disimpan sebagai bcrypt hash; secret autentikasi tidak ada di source.
- Data database dan upload tetap ada setelah container direcreate.
- Konten lama tidak tampil; About/hero/kontak identitas tetap dapat diedit.

## Risiko dan keputusan terbuka

- Tidak adanya batas upload membuat penggunaan disk sulit diprediksi. Tetapkan batas operasional atau pemantauan disk sebelum produksi jika volume upload bertambah.
- Native addon `better-sqlite3` perlu diuji dalam target image Linux/arsitektur VPS Portainer.
- Akun awal dengan password `admin` lemah; mitigasi yang disetujui hanya peringatan, bukan pemaksaan. Lindungi akses deployment awal dan ubah password sesegera mungkin.
- Lisensi TinyMCE self-hosted: konfigurasi referensi memakai `licenseKey="gpl"`. Pastikan penggunaan/deployment memenuhi syarat lisensi GPL sebelum rilis.
- Folder sumber foto ditemukan di root repo sebagai `foto/foto profil/` dan foto kerja di `foto/`; jangan menganggapnya sudah berada di `public/`. Tentukan langkah pemindahan/penyalinan dan URL runtime saat implementasi tanpa menghapus file sumber secara tidak sengaja.
- Batas format file yang diterima dan strategi pembuatan thumbnail video lokal belum dipastikan; jangan menganggap upload video lokal bisa menghasilkan thumbnail tanpa proses tambahan.
