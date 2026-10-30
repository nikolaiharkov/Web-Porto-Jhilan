import { getDb, nowIso } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import type { SiteSettings, SocialLink } from "@/lib/types";
import { mediaRepository } from "@/repositories/media.repository";

interface SettingsRow {
  id: number;
  brand_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_short: string;
  about_full: string;
  profile_media_id: number | null;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  socials: string;
  updated_at: string;
}

const DEFAULTS = {
  brandName: "Jhilan Al Farisi",
  heroTitle: "Jhilan Al Farisi",
  heroSubtitle: "Photographer • Videographer • Editor",
  aboutShort: "",
  aboutFull: "",
  contactEmail: "",
  contactPhone: "",
  contactWhatsapp: "",
  socials: [] as SocialLink[],
};

export function readSettings(): SiteSettings {
  let row: SettingsRow | undefined;
  try {
    row = getDb().prepare("SELECT * FROM site_settings WHERE id = 1").get() as SettingsRow | undefined;
  } catch {
    row = undefined;
  }
  if (!row) {
    return {
      ...DEFAULTS,
      profileMediaId: null,
      profileMedia: null,
      updatedAt: nowIso(),
    };
  }

  const media = row.profile_media_id ? mediaRepository.findById(row.profile_media_id) : null;

  return {
    brandName: row.brand_name || DEFAULTS.brandName,
    heroTitle: row.hero_title || DEFAULTS.heroTitle,
    heroSubtitle: row.hero_subtitle || DEFAULTS.heroSubtitle,
    aboutShort: row.about_short,
    aboutFull: row.about_full,
    profileMediaId: row.profile_media_id,
    profileMedia: media
      ? {
          ...media,
          url: `/media/${media.storagePath.split("/").map(encodeURIComponent).join("/")}`,
        }
      : null,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactWhatsapp: row.contact_whatsapp,
    socials: parseJsonArray<SocialLink>(row.socials),
    updatedAt: row.updated_at,
  };
}

export interface UpdateSettingsInput {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutShort: string;
  aboutFull: string;
  profileMediaId: number | null;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  socials: SocialLink[];
}

export const settingsRepository = {
  get(): SiteSettings {
    return readSettings();
  },

  update(input: UpdateSettingsInput): void {
    getDb()
      .prepare(
        `INSERT INTO site_settings (id, brand_name, hero_title, hero_subtitle, about_short, about_full,
         profile_media_id, contact_email, contact_phone, contact_whatsapp, socials, updated_at)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           brand_name = excluded.brand_name,
           hero_title = excluded.hero_title,
           hero_subtitle = excluded.hero_subtitle,
           about_short = excluded.about_short,
           about_full = excluded.about_full,
           profile_media_id = excluded.profile_media_id,
           contact_email = excluded.contact_email,
           contact_phone = excluded.contact_phone,
           contact_whatsapp = excluded.contact_whatsapp,
           socials = excluded.socials,
           updated_at = excluded.updated_at`
      )
      .run(
        input.brandName,
        input.heroTitle,
        input.heroSubtitle,
        input.aboutShort,
        input.aboutFull,
        input.profileMediaId,
        input.contactEmail,
        input.contactPhone,
        input.contactWhatsapp,
        JSON.stringify(input.socials),
        nowIso()
      );
  },
};
