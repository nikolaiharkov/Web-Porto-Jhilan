"use client";

import Link from "next/link";
import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteProjectAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonDanger, buttonGhost } from "@/components/dashboard/ui";
import { formatDateId } from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function ProjectTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [state, action] = useActionState(deleteProjectAction, idleState);

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state, router]);

  async function confirmDelete(project: Project) {
    const result = await Swal.fire({
      title: "Hapus proyek?",
      text: `"${project.title}" dan seluruh relasi medianya akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#b91c1c",
    });
    if (!result.isConfirmed) return;
    const formData = new FormData();
    formData.append("id", String(project.id));
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Proyek</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Media</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 shrink-0 overflow-hidden rounded bg-slate-100">
                    {project.featured ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.featured.url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{project.title}</p>
                    <p className="text-[11px] text-slate-500">/{project.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{project.category?.name ?? "—"}</td>
              <td className="px-4 py-3 text-slate-600">{project.media.length}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    project.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {project.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[12px] text-slate-500">
                {formatDateId(project.publishedAt ?? project.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {project.status === "published" ? (
                    <Link href={`/portofolio/${project.slug}`} target="_blank" className={buttonGhost}>
                      Lihat
                    </Link>
                  ) : null}
                  <Link href={`/dashboard/portofolio/${project.id}`} className={buttonGhost}>
                    Ubah
                  </Link>
                  <button type="button" onClick={() => confirmDelete(project)} className={buttonDanger}>
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
    </div>
  );
}
