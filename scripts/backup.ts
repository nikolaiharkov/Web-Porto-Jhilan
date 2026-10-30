import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { loadScriptEnv } from "./script-env.ts";

const env = loadScriptEnv();

if (!existsSync(env.dbPath)) {
  console.error(`[backup] database tidak ditemukan di ${env.dbPath}`);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const targetDir = path.join(env.dataDir, "backups", stamp);
mkdirSync(targetDir, { recursive: true });

const db = new Database(env.dbPath, { readonly: true });
await db.backup(path.join(targetDir, "app.db"));
db.close();

if (existsSync(env.mediaDir)) {
  cpSync(env.mediaDir, path.join(targetDir, "media"), { recursive: true });
}

console.log(`[backup] tersimpan di ${targetDir}`);
