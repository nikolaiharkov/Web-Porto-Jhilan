"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/format";
import { buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import type { MediaWithUrl } from "@/lib/types";

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Media Library",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaWithUrl) => void;
  title?: string;
}) {
  const [items, setItems] = useState<MediaWithUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/media")
      .then((response) => response.json())
      .then((payload) => setItems(payload.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = query
    ? items.filter((item) => item.originalName.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className={buttonGhost}>
            Tutup
          </button>
        </header>

        <div className="border-b border-slate-200 px-5 py-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama berkas…"
            className={inputClass}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? <p className="text-sm text-slate-500">Memuat…</p> : null}
          {!loading && filtered.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada media yang cocok.</p>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-3">
            {filtered.map((media) => (
              <li key={media.id}>
                <button
                  type="button"
                  onClick={() => onSelect(media)}
                  className="w-full overflow-hidden rounded-lg border border-slate-200 text-left transition hover:border-slate-900"
                >
                  <div className="aspect-video bg-slate-100">
                    {media.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={media.url} alt={media.originalName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">Video</div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-[11px] font-medium text-slate-900">{media.originalName}</p>
                    <p className="text-[10px] text-slate-500">{formatBytes(media.byteSize)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-slate-200 px-5 py-3 text-[11px] text-slate-500">
          Unggah berkas baru melalui menu Media.
        </footer>
      </div>
    </div>
  );
}
