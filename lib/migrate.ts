import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export interface MigrationResult {
  applied: string[];
  skipped: string[];
}

export function runMigrations(dbPath: string, migrationsDir: string): MigrationResult {
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec("CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");

  const rows = db.prepare("SELECT name FROM _migrations").all() as Array<{ name: string }>;
  const done = new Set(rows.map((row) => row.name));

  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const applied: string[] = [];
  const skipped: string[] = [];
  const mark = db.prepare("INSERT INTO _migrations (name, applied_at) VALUES (?, ?)");

  for (const file of files) {
    if (done.has(file)) {
      skipped.push(file);
      continue;
    }
    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      mark.run(file, new Date().toISOString());
    })();
    applied.push(file);
  }

  db.close();
  return { applied, skipped };
}
