"use client";

import Link from "next/link";
import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteArticleAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonDanger, buttonGhost } from "@/components/dashboard/ui";
import { formatDateId } from "@/lib/utils";
import type { Article, Category } from "@/lib/types";

export default function ArticleTable({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const router = useRouter();
  const [state, action] = useActionState(deleteArticleAction, idleState);

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state, router]);

  async function confirmDelete(article: Article) {
    const result = await Swal.fire({
      title: "Hapus artikel?",
      text: `"${article.title}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#b91c1c",
    });
    if (!result.isConfirmed) return;
    const formData = new FormData();
    formData.append("id", String(article.id));
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {articles.map((article) => (
            <tr key={article.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{article.title}</p>
                <p className="text-[11px] text-slate-500">/{article.slug}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{article.category?.name ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    article.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {article.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[12px] text-slate-500">
                {formatDateId(article.publishedAt ?? article.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {article.status === "published" ? (
                    <Link href={`/artikel/${article.slug}`} target="_blank" className={buttonGhost}>
                      Lihat
                    </Link>
                  ) : null}
                  <Link href={`/dashboard/artikel/${article.id}`} className={buttonGhost}>
                    Ubah
                  </Link>
                  <button type="button" onClick={() => confirmDelete(article)} className={buttonDanger}>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.status === "error" ? (
        <p className="border-t border-slate-100 px-4 py-2 text-xs text-red-700">{state.message}</p>
      ) : null}
      {categories.length === 0 ? (
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
          Belum ada kategori artikel. Tambahkan di menu Kategori Artikel bila diperlukan.
        </p>
      ) : null}
    </div>
  );
}
