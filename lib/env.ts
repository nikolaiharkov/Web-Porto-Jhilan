import path from "node:path";
import { z } from "zod";

const envSchema = z.object({
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET minimal 32 karakter"),
  ADMIN_USERNAME: z.string().min(1).default("admin"),
  ADMIN_PASSWORD: z.string().min(1).default("admin"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATA_DIR: z.string().min(1).default("./storage"),
});

export type AppEnv = z.infer<typeof envSchema> & {
  dataDir: string;
  dbPath: string;
  mediaDir: string;
};

let cached: AppEnv | null = null;

function build(): AppEnv {
  const parsed = envSchema.safeParse({
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATA_DIR: process.env.DATA_DIR,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Konfigurasi environment tidak valid -> ${detail}`);
  }

  const dataDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), parsed.data.DATA_DIR);

  return {
    ...parsed.data,
    dataDir,
    dbPath: path.join(dataDir, "app.db"),
    mediaDir: path.join(dataDir, "media"),
  };
}

export function getEnv(): AppEnv {
  if (!cached) cached = build();
  return cached;
}

export function getAppUrl(): string {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${getAppUrl()}/`).toString();
}
