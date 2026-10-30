import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getEnv } from "@/lib/env";

export type Db = Database.Database;

const globalForDb = globalThis as unknown as { db?: Db };

function create(): Db {
  const env = getEnv();
  mkdirSync(path.dirname(env.dbPath), { recursive: true });
  const instance = new Database(env.dbPath);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.pragma("busy_timeout = 5000");
  return instance;
}

export function getDb(): Db {
  if (!globalForDb.db) globalForDb.db = create();
  return globalForDb.db;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function transaction<T>(fn: () => T): T {
  return getDb().transaction(fn)();
}
