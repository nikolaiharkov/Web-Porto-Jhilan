"use client";

import { useState } from "react";
import MediaPicker from "@/components/dashboard/media-picker";
import { buttonGhost } from "@/components/dashboard/ui";
import type { MediaWithUrl } from "@/lib/types";

export default function FeaturedPicker({
  name,
  media,
  defaultValue,
}: {
  name: string;
  media: MediaWithUrl[];
  defaultValue: number | null;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(defaultValue);
  const [open, setOpen] = useState(false);

  const selected = media.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input type="hidden" name={name} value={selectedId ?? ""} />

      <div className="h-20 w-32 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        {selected ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected.url} alt={selected.originalName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-slate-500">Belum dipilih</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => setOpen(true)} className={buttonGhost}>
          Pilih dari Media Library
        </button>
        {selectedId ? (
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-[11px] text-red-600 underline underline-offset-2"
          >
            Lepas pilihan
          </button>
        ) : null}
      </div>

      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        title="Pilih featured image"
        onSelect={(item) => {
          setSelectedId(item.id);
          setOpen(false);
        }}
      />
    </div>
  );
}
