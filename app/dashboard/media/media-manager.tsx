"use client";

import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteMediaAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonDanger, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import { formatBytes } from "@/lib/format";
import type { MediaWithUrl } from "@/lib/types";

export default function MediaManager({
  initial,
}: {
  initial: Array<MediaWithUrl & { usage: Array<{ kind: string; label: string; slug: string }> }>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [deleteState, deleteAction] = useActionState(deleteMediaAction, idleState);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const handledDeleteState = useRef<typeof deleteState | null>(null);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  useEffect(() => {
    if (pendingDeleteId === null) return;
    if (handledDeleteState.current === deleteState) return;
    if (deleteState.status === "idle") return;

    handledDeleteState.current = deleteState;

    if (deleteState.status === "success") {
      setItems((current) => current.filter((item) => item.id !== pendingDeleteId));
      router.refresh();
    }

    setPendingDeleteId(null);
  }, [deleteState, pendingDeleteId, router]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);

    const body = new FormData();
    Array.from(files).forEach((file) => body.append("file", file));

    const response = await fetch("/api/uploads", { method: "POST", body });
    const payload = await response.json().catch(() => null);
    setUploading(false);

    if (!response.ok) {
      setMessage({ kind: "error", text: payload?.error?.message ?? "Upload gagal" });
      return;
    }

    setMessage({ kind: "success", text: `${payload.data.length} berkas diunggah` });
    router.refresh();
    setItems((current) => [
      ...(payload.data as MediaWithUrl[]).map((media) => ({ ...media, usage: [] })),
      ...current,
    ]);
  }

  async function confirmDelete(media: MediaWithUrl & { usage: Array<{ kind: string; label: string; slug: string }> }) {
    const usageText = media.usage.length
      ? media.usage.map((item) => `• ${item.label}${item.slug ? ` (/…/${item.slug})` : ""}`).join("\n")
      : "Tidak ada konten yang memakai media ini.";

    const result = await Swal.fire({
      title: "Hapus media?",
      html: `<p style="font-size:13px;text-align:left">Media yang dihapus akan tampil sebagai placeholder pada konten berikut:</p><pre style="text-align:left;font-size:12px;white-space:pre-wrap">${usageText}</pre>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#b91c1c",
    });

    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append("mediaId", String(media.id));
    setPendingDeleteId(media.id);
    startTransition(() => {
      deleteAction(formData);
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <label htmlFor="media-upload" className="block text-sm font-semibold text-slate-900">
          Unggah media
        </label>
        <p className="mt-1 text-xs text-slate-500">Foto atau video, bisa banyak berkas sekaligus.</p>
        <input
          id="media-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          onChange={(event) => handleUpload(event.target.files)}
          className={`${inputClass} mt-3`}
        />
        {uploading ? <p className="mt-2 text-xs text-slate-600">Mengunggah…</p> : null}
        {message ? (
          <p
            className={`mt-2 rounded-md px-3 py-2 text-xs ${
              message.kind === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.text}
          </p>
        ) : null}
        {deleteState.status !== "idle" && deleteState.status === "error" ? (
          <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{deleteState.message}</p>
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Pustaka ({items.length})</h2>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Belum ada media.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((media) => (
              <li key={media.id} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="aspect-video bg-slate-100">
                  {media.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.url} alt={media.originalName} className="h-full w-full object-cover" />
                  ) : (
                    <video src={media.url} className="h-full w-full object-cover" controls preload="metadata" />
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-xs font-medium text-slate-900" title={media.originalName}>
                    {media.originalName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {media.kind} · {formatBytes(media.byteSize)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Dipakai: {media.usage.length ? media.usage.map((item) => item.label).join(", ") : "—"}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => navigator.clipboard.writeText(media.url)} className="text-[11px] underline underline-offset-2">
                      Salin URL
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(media)}
                      className="text-[11px] text-red-600 underline underline-offset-2"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
