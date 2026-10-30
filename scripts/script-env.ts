import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getEnv } from "../lib/env.ts";

function loadDotEnv(file: string): void {
  if (!existsSync(file)) return;
  const content = readFileSync(file, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

let loaded = false;

export function loadScriptEnv() {
  if (!loaded) {
    loadDotEnv(path.join(process.cwd(), ".env.local"));
    loadDotEnv(path.join(process.cwd(), ".env"));
    if (!process.env.SESSION_SECRET) {
      process.env.SESSION_SECRET = "dev-only-secret-change-me-000000000000";
    }
    loaded = true;
  }
  return getEnv();
}
