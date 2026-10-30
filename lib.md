# Stack & Library — Web Porto Jhilan

Dokumen ini mencatat stack yang benar-benar dipakai. Sumber kebenaran: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `db/migrations/*.sql`, dan impor di `app/`, `components/`, `lib/`, `services/`, `repositories/`.

Terakhir diverifikasi: 30 Oktober 2026.

---

## 1. Ringkasan

| Item | Nilai |
| --- | --- |
| Nama paket | `portfolio-jaf` (`0.1.0`, private) |
| Jenis | Portofolio film producer + CMS |
| Framework | Next.js 16.4.3 App Router (Turbopack) |
| Bahasa | TypeScript strict |
| Styling | Tailwind 3 + CSS kustom |
| Rendering | Dinamis (`force-dynamic`) untuk halaman ber-DB |
| Database | SQLite via `better-sqlite3` (raw SQL) |
| Auth | `iron-session` + `bcryptjs` |

## 2. Dependency runtime

| Library | Fungsi |
| --- | --- |
| `next` 16.4.3 | Framework |
| `react` / `react-dom` 19.2.4 | UI |
| `better-sqlite3` 13 | Driver SQLite sinkron |
| `iron-session` 8 | Cookie sesi terenkripsi |
| `bcryptjs` 3 | Hash password |
| `zod` 4 | Validasi input |
| `isomorphic-dompurify` 3.19 | Sanitasi HTML editor |
| `tinymce` 8 + `@tinymce/tinymce-react` 6 | Rich text self-hosted |
| `sweetalert2` 11 | Dialog konfirmasi destruktif |
| `server-only` | Guard modul server |
| `tailwindcss` / `postcss` / `autoprefixer` | Build CSS |

Dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/better-sqlite3`.

## 3. Struktur

```
app/
  layout.tsx page.tsx about/ portofolio/ artikel/ login/
  dashboard/**            CRUD + Server Actions
  api/uploads/route.ts    upload biner (nodejs runtime)
  api/media/route.ts      daftar media untuk picker
  media/[...path]/route.ts penyaji berkas dari DATA_DIR
  sitemap.ts robots.ts not-found.tsx error.tsx
components/
  site/**                 komponen publik
  dashboard/**            shell, form, picker, editor, tabel
lib/
  env.ts db.ts migrate.ts session.ts sanitize.ts slug/utils.ts
  types.ts action-state.ts structured-data.ts format.ts site.ts
repositories/             satu-satunya lapisan SQL
services/                 auth + media
db/migrations/0001_init.sql
scripts/                  migrate, bootstrap-admin, backup, import-assets, copy-tinymce
```

## 4. Skema database

`users`, `media`, `portfolio_categories`, `article_categories`, `projects`, `project_media`, `articles`, `site_settings`.

- `PRAGMA journal_mode = WAL`, `foreign_keys = ON`, `busy_timeout = 5000`.
- `projects.category_id` → `ON DELETE RESTRICT` (kategori aktif tak bisa dihapus).
- `articles.category_id` → `ON DELETE SET NULL` (artikel tetap ada).
- `project_media.media_id`, `articles.featured_media_id`, `site_settings.profile_media_id` → `ON DELETE SET NULL` (placeholder saat media hilang).

## 5. Penyimpanan

`DATA_DIR` (default `./storage` lokal, `/data` di container):

```
app.db        SQLite + WAL
media/        berkas unggahan, disajikan lewat /media/...
backups/      hasil db:backup
```

Media tidak pernah ditaruh di `public/`. `.gitignore` meng-ignore `/storage/`, `/data/`, `/foto/`, `/public`.

## 6. Perintah

| Script | Perintah |
| --- | --- |
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `postinstall` | `node scripts/copy-tinymce.mjs` |
| `db:migrate` | jalankan migrasi `.sql` berurutan |
| `db:bootstrap` | buat akun awal bila tabel `users` kosong |
| `db:backup` | `db.backup()` + salin media |
| `assets:import` | impor `foto/` ke Media Library |

## 7. Catatan

1. `next/image` memakai `unoptimized: true`; ukuran asli disajikan dari volume.
2. Upload biner lewat Route Handler karena Server Action dibatasi 1MB.
3. `NEXT_PUBLIC_APP_URL` di-inline saat build → ubah berarti rebuild.
4. Tinymce disalin ke `public/tinymce` oleh `postinstall`, tidak di-commit.
5. Semua halaman publik ber-DB memakai `force-dynamic` agar perubahan langsung terlihat.
6. Tidak ada framework test; verifikasi mengandalkan `tsc --noEmit` dan `next build`.
