# AGENTS.md — Aturan kerja agent

Baca `PRD.md`, `DESIGN.md`, `SEO.md`, dan file ini sebelum menulis kode.

## Stack terkunci

- Next.js 16.4.3 (App Router, Turbopack), React 19.2.4, TypeScript strict, Tailwind 3.
- Database: SQLite via `better-sqlite3` (raw SQL, tanpa ORM). Hanya `repositories/**` yang menyentuh `lib/db.ts`.
- Auth: `iron-session` + `bcryptjs`. Satu peran, semua akun setara.
- Validasi: `zod`. Sanitasi HTML: `isomorphic-dompurify` di `lib/sanitize.ts`.
- Rich text: TinyMCE self-hosted (`public/tinymce`, disalin oleh `scripts/copy-tinymce.mjs`).
- Konfirmasi destruktif: `sweetalert2`.

## Arsitektur

```
app/(publik)          Server Components, baca data via repositori
app/dashboard/**      Server Actions + guard requireUser()
app/api/uploads       route handler upload biner (Node runtime)
app/media/[...path]   penyaji berkas dari DATA_DIR/media
repositories/**       satu-satunya lapisan SQL
services/**           aturan bisnis (auth, media)
lib/**                env, db, session, sanitize, utils, structured-data
db/migrations/*.sql   migrasi idempoten berurutan
```

Arah dependensi: `app/components → services/repositories → lib`. Dilarang query DB dari komponen atau action.

## Aturan wajib

1. Baca dokumentasi lokal di `node_modules/next/dist/docs/` untuk API Next yang tidak jelas. Versi ini bukan Next.js lama: `middleware` sudah menjadi `proxy`, `params` adalah Promise.
2. Semua mutasi CMS adalah Server Action dengan `await requireUser()` di baris pertama logika.
3. Upload biner tidak lewat Server Action (batas body 1MB). Gunakan `POST /api/uploads`.
4. Jangan menyimpan berkas di `public/`; gunakan `getEnv().mediaDir`.
5. Setiap HTML dari editor disanitasi dengan `sanitizeHtml` sebelum disimpan.
6. Konten draft tidak boleh bocor ke halaman publik, sitemap, atau metadata.
7. Canonical/OG memakai `getAppUrl()`, bukan header host request.
8. Slug unik dihasilkan di action (`uniqueSlug`), bukan input mentah pengguna.
9. Jangan menambah dependency tanpa alasan tertulis di PRD.
10. Jangan menulis komentar dekoratif; kode harus menjelaskan dirinya.

## Perintah

```
npm run dev
npm run build
npx tsc --noEmit
npm run db:migrate
npm run db:bootstrap
npm run db:backup
npm run assets:import
```

## Konvensi

- Komponen: PascalCase file untuk komponen React; utilitas `kebab-case.ts`.
- Repositori: `*.repository.ts` mengekspor objek dengan method eksplisit.
- Service: `*.service.ts`, melempar error dengan `code` yang bisa dipetakan action.
- Action mengembalikan `ActionState` (`lib/action-state.ts`).
- 1 commit per milestone: `feat:`, `fix:`, `chore:`, `docs:`.

## Verifikasi sebelum menyatakan selesai

- `npx tsc --noEmit` bersih.
- `npm run build` hijau.
- Tidak ada `any` baru tanpa alasan.
- Draft tidak muncul di `/portofolio`, `/artikel`, `/sitemap.xml`.
