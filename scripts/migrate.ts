import path from "node:path";
import { runMigrations } from "../lib/migrate.ts";
import { loadScriptEnv } from "./script-env.ts";

const env = loadScriptEnv();
const migrationsDir = path.join(process.cwd(), "db", "migrations");
const result = runMigrations(env.dbPath, migrationsDir);

console.log(`[migrate] diterapkan: ${result.applied.length ? result.applied.join(", ") : "-"}`);
console.log(`[migrate] dilewati: ${result.skipped.length ? result.skipped.join(", ") : "-"}`);
