#!/bin/sh
set -e

echo "[entrypoint] menjalankan migrasi basis data"
node --experimental-strip-types scripts/migrate.ts

echo "[entrypoint] memastikan akun bootstrap"
node --experimental-strip-types scripts/bootstrap-admin.ts

echo "[entrypoint] menyiapkan aset seed"
node --experimental-strip-types scripts/import-assets.ts

echo "[entrypoint] memulai Next.js"
exec node server.js
