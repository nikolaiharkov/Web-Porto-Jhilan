"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveArticleAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import ArticleEditor from "@/components/dashboard/article-editor";
import FeaturedPicker from "@/components/dashboard/featured-picker";
import type { Article, Category, MediaWithUrl } from "@/lib/types";

export default function ArticleForm({
  article,
  categories,
  media,
}: {
  article: Article | null;
  categories: Category[];
  media: MediaWithUrl[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveArticleAction, idleState);

  useEffect(() => {
    if (state.status === "success") router.push("/dashboard/artikel");
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-1 block text-xs text-slate-600">
              Judul
            </label>
            <input id="title" name="title" required defaultValue={article?.title ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-xs text-slate-600">
              Slug (opsional)
            </label>
            <input id="slug" name="slug" defaultValue={article?.slug ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-xs text-slate-600">
              Kategori (opsional)
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={article?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="mb-1 block text-xs text-slate-600">
              Ringkasan
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={article?.excerpt ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <ArticleEditor name="content" defaultValue={article?.content ?? ""} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Featured image</h2>
        <p className="mt-1 text-xs text-slate-500">
          Media pertama yang dipilih dipakai sebagai gambar unggulan artikel.
        </p>
        <div className="mt-3">
          <FeaturedPicker name="featuredMediaId" media={media} defaultValue={article?.featuredMediaId ?? null} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">SEO</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="seoTitle" className="mb-1 block text-xs text-slate-600">
              SEO title (opsional)
            </label>
            <input id="seoTitle" name="seoTitle" defaultValue={article?.seoTitle ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="seoDescription" className="mb-1 block text-xs text-slate-600">
              SEO description (opsional)
            </label>
            <input
              id="seoDescription"
              name="seoDescription"
              defaultValue={article?.seoDescription ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {state.status === "error" ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" name="status" value="draft" disabled={pending} className={buttonGhost}>
          Simpan draft
        </button>
        <button type="submit" name="status" value="published" disabled={pending} className={buttonPrimary}>
          {pending ? "Menyimpan…" : "Publikasikan"}
        </button>
      </div>
    </form>
  );
}
