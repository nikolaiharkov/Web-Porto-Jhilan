import "server-only";
import { settingsRepository } from "@/repositories/settings.repository";
import { getAppUrl } from "@/lib/env";
import type { SiteSettings } from "@/lib/types";

export async function siteSettings(): Promise<SiteSettings> {
  return settingsRepository.get();
}

export async function siteOrigin(): Promise<string> {
  return getAppUrl();
}
