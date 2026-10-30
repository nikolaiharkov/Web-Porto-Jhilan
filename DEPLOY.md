# Deploy CMS Portofolio

Satu container Next.js + SQLite. Database dan media berada pada satu volume persisten (`/data`).

## Kebutuhan

- VPS Linux dengan Docker/Podman dan Portainer.
- Node 22+ bila menjalankan build di host.
- Image basis `node:22-bookworm-slim` (glibc) agar `better-sqlite3` memakai prebuilt binary.

## Variabel environment

| Nama | Wajib | Keterangan |
| --- | --- | --- |
| `SESSION_SECRET` | ya | Minimal 32 karakter acak. `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | ya | Origin publik absolut, misal `https://alfrsproject.biz.id` |
| `ADMIN_USERNAME` | tidak | Default `admin`, hanya dipakai saat tabel users kosong |
| `ADMIN_PASSWORD` | tidak | Default `admin`. Ganti segera setelah login pertama |
| `DATA_DIR` | tidak | Default `/data` di container, `./storage` di lokal |

## Langkah deploy

1. Buat stack di Portainer dari repository ini, atau jalankan `docker compose up -d --build`.
2. Isi environment di UI Portainer.
3. Tunggu healthcheck. Entrypoint menjalankan migrasi dan bootstrap akun otomatis.
4. Buka `/login`, masuk dengan akun bootstrap, lalu segera ganti password.
5. Unggah media lewat menu Media, isi About dan Pengaturan Situs.

## Volume

`jaf-data` menyimpan:

```
/data/app.db          # SQLite (mode WAL)
/data/app.db-wal      # ikut terbawa, jangan dihapus terpisah
/data/app.db-shm
/data/media/          # berkas unggahan
```

Backup harus mencakup seluruh direktori volume.

## Backup

Di dalam container:

```sh
npm run db:backup
```

Perintah ini memakai `db.backup()` (aman saat WAL aktif) dan menyalin seluruh media ke `/data/backups/<timestamp>/`.
Jadwalkan lewat cron host, misal:

```
0 3 * * * docker exec jaf-web npm run db:backup
```

Salin hasil backup ke luar VPS secara berkala. Backup di volume yang sama tidak melindungi dari kerusakan disk.

## Impor aset awal

Bila folder `foto/` masih tersedia di dalam image/host:

```sh
npm run db:migrate
npm run db:import-assets   # -> npm run assets:import
```

Skrip menyalin foto ke `DATA_DIR/media/seed/` dan mendaftarkannya ke Media Library. Setelah itu pilih manual sebagai foto profil di dashboard.

## Catatan operasional

- Satu instance saja. SQLite hanya melayani satu penulis pada satu waktu.
- `NEXT_PUBLIC_APP_URL` di-inline saat build: ubah berarti rebuild image.
- Media disajikan lewat `/media/...` dari volume, bukan dari `public/`.
- Lisensi TinyMCE self-hosted memakai mode GPL (`licenseKey="gpl"`). Pastikan penggunaan sesuai ketentuan GPL sebelum rilis.
- Tidak ada batas ukuran upload di aplikasi. Pantau kapasitas disk volume.
