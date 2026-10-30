import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { loadScriptEnv } from "./script-env.ts";

const env = loadScriptEnv();

const sources: Array<{ name: string; label: string }> = [
  { name: "me-in-pkbm-2026-1.jpg.jpeg", label: "foto profil" },
  { name: "dop-antu-banyu-6.jpg.jpeg", label: "foto kerja" },
  { name: "dop-antu-banyu-4.jpg.jpeg", label: "foto kerja" },
  { name: "dop-antu-banyu-1.jpg.jpeg", label: "foto kerja" },
  { name: "chin-v4.png", label: "foto kerja" },
];

const db = new Database(env.dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const insert = db.prepare(
  `INSERT INTO media (storage_path, kind, mime, original_name, byte_size, created_at)
   VALUES (?, 'image', ?, ?, ?, ?)
   ON CONFLICT(storage_path) DO NOTHING`
);

const now = new Date().toISOString();
let imported = 0;

for (const source of sources) {
  const absolute = path.join(process.cwd(), "seed", source.name);
  if (!existsSync(absolute)) {
    console.warn(`[assets] lewat: seed/${source.name} tidak ditemukan`);
    continue;
  }
  const storagePath = `seed/${source.name}`;
  const target = path.join(env.mediaDir, storagePath);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(absolute, target);
  const mime = source.name.endsWith(".png") ? "image/png" : "image/jpeg";
  insert.run(storagePath, mime, `seed/${source.name}`, statSync(target).size, now);
  imported += 1;
  console.log(`[assets] ${source.label}: seed/${source.name} -> ${storagePath}`);
}

db.close();
console.log(`[assets] ${imported} berkas tersedia di ${env.mediaDir}`);
