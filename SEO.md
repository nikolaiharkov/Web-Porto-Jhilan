# SEO: CMS portofolio film producer

## Tujuan

Pastikan halaman publik dan konten yang dipublikasikan dapat ditemukan, dipahami, dan dibagikan dengan metadata yang benar. Draft dan dashboard tidak boleh masuk hasil pencarian.

## URL kanonis

- Homepage: `/`
- Profil: `/about`
- Katalog proyek: `/portofolio`
- Detail proyek: `/portofolio/[slug]`
- Katalog artikel: `/artikel`
- Detail artikel: `/artikel/[slug]`
- Canonical harus memakai origin absolut dari konfigurasi deployment, bukan host dari request yang tidak dipercaya.
- URL proyek lama `/project/[id]` tidak dipertahankan dan tidak dibuat redirect karena situs dimulai tanpa portofolio lama.

## Metadata halaman

- Setiap halaman publik menyediakan title, description, canonical, Open Graph, dan Twitter metadata.
- Halaman detail memakai title dan ringkasan SEO khusus jika tersedia. Jika kosong, pakai judul dan ringkasan konten.
- Open Graph image wajib URL absolut dan dapat dirayapi. Gunakan featured image konten jika tersedia.
- Homepage/About menggunakan foto profil/brand image dari pengaturan situs sebagai social image fallback.
- Jangan menghasilkan metadata konten draft pada halaman publik.
- Not-found content memberi status 404, bukan halaman kosong dengan status 200.

## Indexing dan sitemap

- `robots.txt` mengizinkan crawl pada rute publik dan melarang `/dashboard`, `/login`, serta `/api`.
- Proteksi indexing tidak bergantung hanya pada robots.txt. Rute dashboard/login juga memakai autentikasi dan metadata noindex yang sesuai.
- Sitemap XML memuat hanya homepage, About, katalog publik, dan detail proyek/artikel published.
- Draft, login, dashboard, API, slug yang tidak ditemukan, dan media privat tidak masuk sitemap.
- Sitemap menggunakan URL absolut. `lastModified` mengikuti `updatedAt` konten yang signifikan; jangan gunakan waktu build saat ini sebagai nilai palsu.
- Sitemap diperbarui saat konten berubah atau dihitung dinamis dari database dengan cache/revalidasi yang sesuai.

## Structured data

- Profil: `Person`/`ProfilePage`, menggunakan nama personal brand, foto profil, bio, URL dan social profiles yang benar-benar tersedia.
- Artikel: `BlogPosting` atau `Article` dengan headline, description, image, author `Person` bernama personal brand, `datePublished`, dan `dateModified` yang sesuai data nyata.
- Proyek: structured data konservatif yang sesuai isi halaman. Jangan melabeli semua karya sebagai `Movie`/`VideoObject` bila proyek sebenarnya berupa dokumentasi event atau kumpulan foto/video. Tambahkan `VideoObject` hanya untuk video yang ditampilkan dan ketika metadata yang dibutuhkan tersedia.
- Breadcrumb: `BreadcrumbList` untuk halaman About, kategori, proyek, dan artikel bila struktur navigasi menampilkannya.
- JSON-LD harus merepresentasikan konten yang terlihat. Hindari data palsu atau properti tanpa sumber.

## Gambar, video, dan rich content

- Featured image proyek/artikel bersumber dari media yang terhubung. Untuk YouTube, ambil thumbnail berdasarkan ID video yang tervalidasi. Untuk video lokal, gunakan foto pertama proyek; bila tidak ada foto gunakan placeholder/fallback brand image sesuai konteks.
- Media yang dipakai sebagai featured image harus bisa diakses crawler dan punya alt text deskriptif jika berupa gambar.
- Upload lokal harus menyajikan URL stabil dari volume persisten. Jangan mengekspos path filesystem.
- Embed YouTube memakai URL embed yang tervalidasi. Beri judul aksesibel pada iframe dan hindari embed yang menghalangi konten inti.
- HTML TinyMCE harus disanitasi sebelum disajikan agar script/markup berbahaya tidak dieksekusi.
- Foto sumber profil saat ini berada di `foto/foto profil/`; foto kerja berada di `foto/`. URL publik final perlu ditentukan saat implementasi. Foto profil dipakai pada halaman profil, brand image, favicon derivative, dan metadata umum; foto kerja menjadi media pendukung, bukan featured image proyek secara otomatis.

## Konten dan pengalaman pencarian

- Judul proyek/artikel harus deskriptif, slug stabil dan unik.
- Ringkasan pendek menjadi snippet default; hindari excerpt kosong pada konten published.
- Kategori memberi navigasi kontekstual. Halaman kategori dapat diindeks hanya bila memiliki konten publik yang cukup dan halaman katalog kategori dirender sebagai halaman bermakna; keputusan ini tidak otomatis berarti membuat route kategori pada versi awal.
- Listing proyek/artikel diurutkan tanggal publikasi terbaru. Pastikan pagination atau pemuatan tambahan tetap menyediakan link crawlable jika katalog tumbuh.
- Katalog portofolio kosong menampilkan pesan yang jelas. Tidak perlu dummy entries untuk SEO.
- Setelah publish, sitemap dan metadata harus mencerminkan konten. Setelah unpublish/delete, URL tidak lagi masuk sitemap dan detail konten memberi 404 atau kebijakan status yang eksplisit.

## SEO teknis dan pengukuran

- Gunakan semantic HTML, satu H1 utama per halaman, heading berurutan, alt text, tautan internal yang dapat dirayapi, dan tampilan responsif.
- Hindari menaruh konten penting hanya di interaksi client-side. Render konten publik di server agar HTML berisi teks dan metadata.
- Tetapkan `NEXT_PUBLIC_APP_URL` atau variabel origin publik non-secret pada deployment untuk canonical, sitemap, Open Graph, dan author URL.
- Sebelum produksi, uji metadata dan JSON-LD dengan Rich Results Test/URL Inspection, cek `robots.txt` dan sitemap pada domain live, serta uji gambar/thumbnail dari luar container.
- Sitemap adalah petunjuk crawl, bukan jaminan pengindeksan atau ranking. Structured data juga tidak menjamin rich result.

## Sumber teknis

- Next.js 16.2.9 Metadata API: https://nextjs.org/docs/16/app/api-reference/functions/generate-metadata
- Next.js `robots.ts`: https://nextjs.org/docs/16/app/api-reference/file-conventions/metadata/robots
- Next.js `sitemap.ts`: https://nextjs.org/docs/16/app/api-reference/file-conventions/metadata/sitemap
- Google Search Central, Build and submit a sitemap (diperiksa 2026-10-30): https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, Article structured data (diperiksa 2026-10-30): https://developers.google.com/search/docs/appearance/structured-data/article
