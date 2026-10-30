"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { projectRepository } from "@/repositories/project.repository";
import { portfolioCategoryRepository } from "@/repositories/category.repository";
import { sanitizeHtml } from "@/lib/sanitize";
import { normalizeMediaUrls } from "@/lib/media-url";
import { slugify } from "@/lib/utils";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";
import type { ContentStatus, Credit, ProjectMediaInput, ProjectMediaType } from "@/lib/types";
const creditSchema = z.object({ label: z.string().max(60), value: z.string().max(120) });

const mediaSchema = z.object({
  type: z.enum(["image", "video", "youtube"]),
  mediaId: z.number().int().positive().nullable(),
  youtubeUrl: z.string().max(300).nullable(),
  youtubeId: z.string().max(20).nullable(),
  title: z.string().max(160),
  alt: z.string().max(160),
});

const projectSchema = z.object({
  id: z.number().int().positive().nullable(),
  title: z.string().trim().min(1, "Judul wajib diisi").max(160),
  slug: z.string().trim().max(80),
  categoryId: z.number().int().positive("Kategori wajib dipilih"),
  summary: z.string().max(400),
  description: z.string().max(200000),
  status: z.enum(["draft", "published"]),
  media: z.array(mediaSchema),
  credits: z.array(creditSchema),
});

function uniqueSlug(base: string, excludeId?: number): string {
  const root = slugify(base) || "proyek";
  let candidate = root;
  let counter = 2;
  while (projectRepository.slugExists(candidate, excludeId ?? undefined)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}

function parseYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname.startsWith("/shorts/") || parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? id : null;
      }
      const id = parsed.searchParams.get("v");
      return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? id : null;
    }
    return null;
  } catch {
    return null;
  }
}

function collectMedia(formData: FormData): { media: ProjectMediaInput[]; error?: string } {
  const rows: ProjectMediaInput[] = [];
  const total = Number(formData.get("mediaCount") ?? 0);

  for (let index = 0; index < total; index += 1) {
    const type = String(formData.get(`media-${index}-type`) ?? "") as ProjectMediaType;
    if (!type) continue;

    const mediaIdRaw = String(formData.get(`media-${index}-mediaId`) ?? "");
    const mediaId = mediaIdRaw ? Number(mediaIdRaw) : null;
    const youtubeUrl = String(formData.get(`media-${index}-youtubeUrl`) ?? "").trim();

    if (type === "youtube") {
      const youtubeId = parseYoutubeId(youtubeUrl);
      if (!youtubeId) return { media: [], error: "URL YouTube tidak valid" };
      rows.push({
        type,
        mediaId: null,
        youtubeUrl,
        youtubeId,
        title: String(formData.get(`media-${index}-title`) ?? "").trim(),
        alt: String(formData.get(`media-${index}-alt`) ?? "").trim(),
      });
      continue;
    }

    if (!mediaId) return { media: [], error: "Setiap media harus memiliki berkas" };
    rows.push({
      type,
      mediaId,
      youtubeUrl: null,
      youtubeId: null,
      title: String(formData.get(`media-${index}-title`) ?? "").trim(),
      alt: String(formData.get(`media-${index}-alt`) ?? "").trim(),
    });
  }

  return { media: rows };
}

export async function saveProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();

    const idRaw = String(formData.get("id") ?? "");
    const id = idRaw ? Number(idRaw) : null;

    const credits: Credit[] = [];
    const creditTotal = Number(formData.get("creditCount") ?? 0);
    for (let index = 0; index < creditTotal; index += 1) {
      const label = String(formData.get(`credit-${index}-label`) ?? "").trim();
      const value = String(formData.get(`credit-${index}-value`) ?? "").trim();
      if (label && value) credits.push({ label, value });
    }

    const collected = collectMedia(formData);
    if (collected.error) return errorState(collected.error);

    const parsed = projectSchema.safeParse({
      id,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      categoryId: Number(formData.get("categoryId") ?? 0),
      summary: String(formData.get("summary") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "draft"),
      media: collected.media,
      credits,
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return errorState(first?.message ?? "Data proyek tidak valid");
    }

    const data = parsed.data;
    if (!portfolioCategoryRepository.findById(data.categoryId)) {
      return errorState("Kategori tidak ditemukan");
    }

    const status = data.status as ContentStatus;
    const existing = data.id ? projectRepository.findById(data.id) : null;
    if (data.id && !existing) return errorState("Proyek tidak ditemukan");

    const publishedAt =
      status === "published" ? (existing?.publishedAt ?? new Date().toISOString()) : null;

    const payload = {
      title: data.title,
      slug: uniqueSlug(data.slug || data.title, data.id ?? undefined),
      categoryId: data.categoryId,
      summary: data.summary,
      description: sanitizeHtml(normalizeMediaUrls(data.description)),
      credits: data.credits,
      status,
      publishedAt,
      media: data.media.map((item, index) => ({ ...item, position: index })),
    };

    if (existing) {
      projectRepository.update(existing.id, payload);
    } else {
      projectRepository.create(payload);
    }

    revalidatePath("/dashboard/portofolio");
    revalidatePath("/portofolio");
    revalidatePath("/");
    return successState(status === "published" ? "Proyek diterbitkan" : "Draft proyek disimpan");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menyimpan proyek"));
  }
}

export async function deleteProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const id = Number(formData.get("id"));
    if (!id) return errorState("Proyek tidak valid");
    projectRepository.delete(id);
    revalidatePath("/dashboard/portofolio");
    revalidatePath("/portofolio");
    return successState("Proyek dihapus");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menghapus proyek"));
  }
}
