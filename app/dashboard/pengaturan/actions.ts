"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { settingsRepository } from "@/repositories/settings.repository";
import { mediaRepository } from "@/repositories/media.repository";
import { sanitizeHtml } from "@/lib/sanitize";
import { normalizeMediaUrls } from "@/lib/media-url";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";

const schema = z.object({
  brandName: z.string().trim().min(1, "Nama brand wajib diisi").max(80),
  heroTitle: z.string().trim().max(120),
  heroSubtitle: z.string().trim().max(160),
  aboutShort: z.string().max(400),
  contactEmail: z.string().trim().max(160),
  contactPhone: z.string().trim().max(40),
  contactWhatsapp: z.string().trim().max(40),
  profileMediaId: z.number().int().positive().nullable(),
  socials: z.array(
    z.object({
      label: z.string().max(40),
      url: z.string().max(300),
      icon: z.string().max(60),
    })
  ),
});

function parseProfileMediaId(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return mediaRepository.findById(id) ? id : null;
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();

    const current = settingsRepository.get();
    const socials: Array<{ label: string; url: string; icon: string }> = [];
    const total = Number(formData.get("socialCount") ?? 0);
    for (let index = 0; index < total; index += 1) {
      const label = String(formData.get(`social-${index}-label`) ?? "").trim();
      const url = String(formData.get(`social-${index}-url`) ?? "").trim();
      const icon = String(formData.get(`social-${index}-icon`) ?? "").trim();
      if (label && url) socials.push({ label, url, icon });
    }

    const parsed = schema.safeParse({
      brandName: String(formData.get("brandName") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
      aboutShort: current.aboutShort,
      contactEmail: String(formData.get("contactEmail") ?? ""),
      contactPhone: String(formData.get("contactPhone") ?? ""),
      contactWhatsapp: String(formData.get("contactWhatsapp") ?? ""),
      profileMediaId: current.profileMediaId,
      socials,
    });

    if (!parsed.success) {
      return errorState(parsed.error.issues[0]?.message ?? "Data pengaturan tidak valid");
    }

    settingsRepository.update({
      ...parsed.data,
      aboutFull: current.aboutFull,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/dashboard/pengaturan");
    return successState("Pengaturan disimpan");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menyimpan pengaturan"));
  }
}

const aboutSchema = z.object({
  aboutShort: z.string().max(400),
});

export async function saveAboutAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const current = settingsRepository.get();
    const aboutFullRaw = String(formData.get("aboutFull") ?? "");
    const parsed = aboutSchema.safeParse({
      aboutShort: String(formData.get("aboutShort") ?? ""),
    });

    if (!parsed.success) {
      return errorState("Ringkasan tentang maksimal 400 karakter");
    }

    settingsRepository.update({
      brandName: current.brandName,
      heroTitle: current.heroTitle,
      heroSubtitle: current.heroSubtitle,
      aboutShort: parsed.data.aboutShort,
      aboutFull: sanitizeHtml(normalizeMediaUrls(aboutFullRaw)),
      profileMediaId: parseProfileMediaId(formData.get("profileMediaId")),
      contactEmail: current.contactEmail,
      contactPhone: current.contactPhone,
      contactWhatsapp: current.contactWhatsapp,
      socials: current.socials,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/dashboard/about");
    return successState("Halaman About disimpan");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menyimpan About"));
  }
}
