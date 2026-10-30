"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import {
  articleCategoryRepository,
  portfolioCategoryRepository,
} from "@/repositories/category.repository";
import { slugify } from "@/lib/utils";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";

const schema = z.object({
  id: z.number().int().positive().nullable(),
  name: z.string().trim().min(1, "Nama kategori wajib diisi").max(60),
  kind: z.enum(["portfolio", "article"]),
});

function repoFor(kind: "portfolio" | "article") {
  return kind === "portfolio" ? portfolioCategoryRepository : articleCategoryRepository;
}

function pathFor(kind: "portfolio" | "article") {
  return kind === "portfolio" ? "/dashboard/kategori-portofolio" : "/dashboard/kategori-artikel";
}

export async function saveCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const idRaw = String(formData.get("id") ?? "");
    const parsed = schema.safeParse({
      id: idRaw ? Number(idRaw) : null,
      name: String(formData.get("name") ?? ""),
      kind: String(formData.get("kind") ?? "portfolio"),
    });

    if (!parsed.success) {
      return errorState(parsed.error.issues[0]?.message ?? "Data kategori tidak valid");
    }

    const repo = repoFor(parsed.data.kind);
    const baseSlug = slugify(parsed.data.name);
    let candidate = baseSlug || "kategori";
    let counter = 2;
    const existing = repo.findBySlug(candidate);
    while (existing && existing.id !== parsed.data.id) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
      const next = repo.findBySlug(candidate);
      if (!next) break;
    }

    if (parsed.data.id) {
      repo.update(parsed.data.id, parsed.data.name, candidate);
    } else {
      repo.create(parsed.data.name, candidate);
    }

    revalidatePath(pathFor(parsed.data.kind));
    revalidatePath("/portofolio");
    revalidatePath("/artikel");
    return successState("Kategori disimpan");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menyimpan kategori"));
  }
}

export async function deleteCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const id = Number(formData.get("id"));
    const kind = String(formData.get("kind") ?? "portfolio") as "portfolio" | "article";
    if (!id) return errorState("Kategori tidak valid");

    const repo = repoFor(kind);
    const usage = repo.usageCount(id);

    if (kind === "portfolio" && usage > 0) {
      return errorState(`Kategori masih dipakai ${usage} proyek. Pindahkan proyek terlebih dahulu.`);
    }

    if (kind === "article" && usage > 0) {
      // ON DELETE SET NULL menjaga artikel tetap ada tanpa kategori.
      repo.delete(id);
      revalidatePath(pathFor(kind));
      revalidatePath("/artikel");
      return successState(`Kategori dihapus, ${usage} artikel menjadi tanpa kategori`);
    }

    repo.delete(id);
    revalidatePath(pathFor(kind));
    revalidatePath("/portofolio");
    return successState("Kategori dihapus");
  } catch (error) {
    return errorState(toMessage(error, "Gagal menghapus kategori"));
  }
}
