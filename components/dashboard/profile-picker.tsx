"use client";

import { useState } from "react";
import MediaPicker from "@/components/dashboard/media-picker";
import { buttonGhost } from "@/components/dashboard/ui";
import type { MediaWithUrl } from "@/lib/types";

export default function ProfilePicker({
  media,
  defaultValue,
}: {
  media: MediaWithUrl[];
  defaultValue: number | null;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = media.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input type="hidden" name="profileMediaId" value={selectedId ?? ""} />
      <div className="h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
        {selected ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-slate-500">Belum ada</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => setOpen(true)} className={buttonGhost}>
          Pilih foto profil
        </button>
        {selectedId ? (
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-[11px] text-red-600 underline underline-offset-2"
          >
            Lepas foto
          </button>
        ) : null}
      </div>

      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        title="Pilih foto profil"
        onSelect={(item) => {
          setSelectedId(item.id);
          setOpen(false);
        }}
      />
    </div>
  );
}
