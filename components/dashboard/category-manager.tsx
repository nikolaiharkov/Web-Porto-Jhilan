"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { deleteCategoryAction, saveCategoryAction } from "@/app/dashboard/kategori/actions";
import { idleState } from "@/lib/action-state";
import { buttonDanger, buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import type { Category } from "@/lib/types";

export default function CategoryManager({
  categories,
  kind,
}: {
  categories: Category[];
  kind: "portfolio" | "article";
}) {
  const router = useRouter();
  const [saveState, saveAction, saving] = useActionState(saveCategoryAction, idleState);
  const [deleteState, deleteAction] = useActionState(deleteCategoryAction, idleState);

  useEffect(() => {
    if (saveState.status === "success") router.refresh();
  }, [saveState, router]);

  useEffect(() => {
    if (deleteState.status === "success") router.refresh();
  }, [deleteState, router]);

  const feedback = [saveState, deleteState].find((state) => state.status !== "idle");

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Tambah kategori</h2>
        <form action={saveAction} className="mt-3 flex flex-wrap items-end gap-3">
          <input type="hidden" name="kind" value={kind} />
          <div className="min-w-[220px] flex-1">
            <label htmlFor="category-name" className="mb-1 block text-xs text-slate-600">
              Nama kategori
            </label>
            <input id="category-name" name="name" required className={inputClass} />
          </div>
          <button type="submit" disabled={saving} className={buttonPrimary}>
            {saving ? "Menyimpan…" : "Tambah"}
          </button>
        </form>
        {feedback ? (
          <p
            className={`mt-3 rounded-md px-3 py-2 text-xs ${
              feedback.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Daftar kategori ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Belum ada kategori.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {categories.map((category) => {
              const count =
                kind === "portfolio" ? (category.projectCount ?? 0) : (category.articleCount ?? 0);

              return (
                <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <form action={saveAction} className="flex flex-1 flex-wrap items-center gap-2">
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      name="name"
                      defaultValue={category.name}
                      required
                      className="w-48 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                    <span className="text-[11px] text-slate-500">/{category.slug}</span>
                    <button type="submit" className={buttonGhost}>
                      Simpan
                    </button>
                  </form>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">{count} dipakai</span>
                    <form action={deleteAction}>
                      <input type="hidden" name="kind" value={kind} />
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className={buttonDanger}
                        disabled={kind === "portfolio" && count > 0}
                        title={
                          kind === "portfolio" && count > 0
                            ? "Kategori masih dipakai proyek"
                            : "Hapus kategori"
                        }
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {kind === "article" ? (
          <p className="mt-4 text-xs text-slate-500">
            Menghapus kategori artikel tidak menghapus artikel; artikel tersebut menjadi tanpa kategori.
          </p>
        ) : null}
      </section>
    </div>
  );
}
