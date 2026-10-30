"use client";

import { useEffect, useState } from "react";

export interface GalleryItem {
  id: number;
  type: "image" | "video" | "youtube";
  url: string | null;
  youtubeId: string | null;
  title: string;
  alt: string;
}

export default function MediaGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((current) => (current === null ? null : (current + 1) % items.length));
      if (event.key === "ArrowLeft")
        setActive((current) => (current === null ? null : (current - 1 + items.length) % items.length));
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, items.length]);

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-white/10 px-6 py-16 text-center text-sm text-gray-500">
        Media untuk proyek ini belum tersedia.
      </div>
    );
  }

  const current = active === null ? null : items[active];

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group relative block w-full overflow-hidden border border-white/10 bg-charcoal"
            >
              <div className="relative aspect-[4/3] w-full bg-black">
                {item.type === "youtube" && item.youtubeId ? (
                  <img
                    src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.alt || item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : item.type === "image" && item.url ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
                    Media tidak tersedia
                  </div>
                )}
                {item.type !== "image" ? (
                  <span className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                    Video
                  </span>
                ) : null}
              </div>
              {item.title ? (
                <p className="p-3 text-left font-body text-xs text-gray-400">{item.title}</p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-4 backdrop-blur md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[9px] uppercase tracking-[0.3em] text-neonCyan">{current.type}</p>
              <h2 className="mt-1 font-display text-sm uppercase tracking-wide text-white">{current.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-white"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center gap-2 py-4">
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => setActive((value) => (value === null ? null : (value - 1 + items.length) % items.length))}
                className="hidden h-12 w-10 items-center justify-center border border-white/10 text-white md:flex"
                aria-label="Sebelumnya"
              >
                ‹
              </button>
            ) : null}

            <div className="flex max-h-[75vh] w-full max-w-5xl items-center justify-center">
              {current.type === "youtube" && current.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}`}
                  title={current.title || "Video YouTube"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full border border-white/10"
                />
              ) : current.type === "video" && current.url ? (
                <video src={current.url} controls autoPlay playsInline className="max-h-[75vh] w-full border border-white/10" />
              ) : current.url ? (
                <img
                  src={current.url}
                  alt={current.alt || current.title}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-gray-500">Media tidak tersedia.</p>
              )}
            </div>

            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => setActive((value) => (value === null ? null : (value + 1) % items.length))}
                className="hidden h-12 w-10 items-center justify-center border border-white/10 text-white md:flex"
                aria-label="Berikutnya"
              >
                ›
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
