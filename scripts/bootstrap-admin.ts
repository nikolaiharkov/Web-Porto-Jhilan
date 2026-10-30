import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { loadScriptEnv } from "./script-env.ts";

const env = loadScriptEnv();
const db = new Database(env.dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const tableExists = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
  .get();

if (!tableExists) {
  console.error("[bootstrap] tabel users belum ada. Jalankan db:migrate lebih dulu.");
  process.exit(1);
}

const { count } = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };

if (count > 0) {
  console.log(`[bootstrap] dilewati, sudah ada ${count} akun.`);
  db.close();
  process.exit(0);
}

const now = new Date().toISOString();
const passwordHash = bcrypt.hashSync(env.ADMIN_PASSWORD, 10);

db.prepare(
  "INSERT INTO users (username, password_hash, is_seed, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
).run(env.ADMIN_USERNAME, passwordHash, now, now);

db.prepare(
  `INSERT INTO site_settings (id, brand_name, hero_title, hero_subtitle, about_short, about_full, contact_email, contact_phone, contact_whatsapp, socials, updated_at)
   SELECT 1, 'Jhilan Al Farisi', 'Jhilan Al Farisi', 'Photographer • Videographer • Editor', '', '', '', '', '', '[]', ?
   WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1)`
).run(now);

console.log(`[bootstrap] akun "${env.ADMIN_USERNAME}" dibuat.`);
db.close();
