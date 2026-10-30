"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { articleRepository } from "@/repositories/article.repository";
import { articleCategoryRepository } from "@/repositories/category.repository";
import { mediaRepository } from "@/repositories/media.repository";
import { sanitizeHtml } from "@/lib/sanitize";
import { normalizeMediaUrls } from "@/lib/media-url";
import { slugify, truncate } from "@/lib/utils";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";
import type { ContentStatus } from "@/lib/types";

const schema = z.object({
  id: z.number().int().positive().nullable(),
  title: z.string().trim().min(1, "Judul wajib diisi").max(160),
  slug: z.string().trim().max(80),
  excerpt: z.string().max(400),
  content: z.string().max(400000),
  categoryId: z.number().int().positive().nullable(),
  featuredMediaId: z.number().int().positive().nullable(),
  seoTitle: z.string().max(160).nullable(),
  seoDescription: z.string().max(300).nullable(),
  status: z.enum(["draft", "published"]),
});

function uniqueSlug(base: string, excludeId?: number): string {
  const root = slugify(base) || "artikel";
  let candidate = root;
  let counter = 2;
  while (articleRepository.slugExists(candidate, excludeId ?? undefined)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}

function resolveFeaturedFromContent(content: string): number | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  if (!match) return null;
  const source = match[1];
  const prefix = "/media/";
  if (!source.startsWith(prefix)) return null;
  const storagePath = decodeURIComponent(source.slice(prefix.length));
  const record = mediaRepository.findByStoragePath(storagePath);
  return record?.id ?? null;
}

export async function saveArticleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();

    const idRaw = String(formData.get("id") ?? "");
    const featuredRaw = String(formData.get("featuredMediaId") ?? "");
    const categoryRaw = String(formData.get("categoryId") ?? "");

    const parsed = schema.safeParse({
      id: idRaw ? Number(idRaw) : null,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      categoryId: categoryRaw ? Number(categoryRaw) : null,
      featuredMediaId: featuredRaw ? Number(featuredRaw) : null,
      seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
      seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
      status: String(formData.get("status") ?? "draft"),
    });

    if (!parsed.success) {
      return errorState(parsed.error.issues[0]?.message ?? "Data artikel tidak valid");
    }

    const data = parsed.data;
    if (data.categoryId && !articleCategoryRepository.findById(data.categoryId)) {
      return errorState("Kategori tidak ditemukan");
    }

    const existing = data.id ? articleRepository.findById(data.id) : null;
    if (data.id && !existing) return errorState("Artikel tidak ditemukan");

    const status = data.status as ContentStatus;
    const publishedAt = status === "published" ? (existing?.publishedAt ?? new Date().toISOString()) : null;
    const cleanContent = sanitizeHtml(normalizeMediaUrls(data.content));
    const featuredMediaId =
      data.featuredMediaId ?? (existing?.featuredMediaId ?? resolveFeaturedFromContent(cleanContent));

    const payload = {
      title: data.title,
      slug: uniqueSlug(data.slug || data.title, data.id ?? undefined),
      excerpt: data.excerpt || truncate(cleanContent, 180),
      content: cleanContent,
      categoryId: data.categoryId,
      featuredMediaId,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      status,
      publishedAt,
    };

    if (existing) {
      articleRepository.update(existing.id, payload);
    } else {
      articleRepository.create(payload);
    }

    revalidatePath("/dashboard/artikel");
    revalidatePath("/artikel");
    revalidatePath("/");
    return successState(status === "published" ? "Artikel diterbitkan" : "Draft artikel disimpan");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menyimpan artikel"));
  }
}

export async function deleteArticleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const id = Number(formData.get("id"));
    if (!id) return errorState("Artikel tidak valid");
    articleRepository.delete(id);
    revalidatePath("/dashboard/artikel");
    revalidatePath("/artikel");
    return successState("Artikel dihapus");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menghapus artikel"));
  }
}
