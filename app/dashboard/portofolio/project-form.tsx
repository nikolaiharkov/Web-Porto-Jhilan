"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProjectAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import MediaPicker from "@/components/dashboard/media-picker";
import dynamic from "next/dynamic";
import type { TinyEditorHandle } from "@/components/dashboard/rich-text-editor";

const RichTextEditor = dynamic(() => import("@/components/dashboard/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
      Memuat editor…
    </div>
  ),
});
import type { Category, Credit, MediaWithUrl, Project, ProjectMediaType } from "@/lib/types";

interface MediaRow {
  key: string;
  type: ProjectMediaType;
  mediaId: number | null;
  media: MediaWithUrl | null;
  youtubeUrl: string;
  title: string;
  alt: string;
}

interface CreditRow {
  key: string;
  label: string;
  value: string;
}

let counter = 0;
function nextKey(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export default function ProjectForm({
  project,
  categories,
  media,
}: {
  project: Project | null;
  categories: Category[];
  media: MediaWithUrl[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveProjectAction, idleState);

  const [description, setDescription] = useState(project?.description ?? "");
  const [rows, setRows] = useState<MediaRow[]>(
    (project?.media ?? []).map((item) => ({
      key: nextKey("media"),
      type: item.type,
      mediaId: item.mediaId,
      media: item.media,
      youtubeUrl: item.youtubeUrl ?? "",
      title: item.title,
      alt: item.alt,
    }))
  );
  const [credits, setCredits] = useState<CreditRow[]>(
    (project?.credits ?? []).map((credit: Credit) => ({
      key: nextKey("credit"),
      label: credit.label,
      value: credit.value,
    }))
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [descriptionPickerOpen, setDescriptionPickerOpen] = useState(false);
  const descriptionHandle = useRef<TinyEditorHandle | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const body = new FormData();
    Array.from(files).forEach((file) => body.append("file", file));
    const response = await fetch("/api/uploads", { method: "POST", body });
    const payload = await response.json().catch(() => null);
    setUploading(false);

    if (!response.ok) {
      setUploadError(payload?.error?.message ?? "Upload gagal");
      return;
    }

    const uploaded = payload.data as MediaWithUrl[];
    setRows((current) => [
      ...current,
      ...uploaded.map((item) => ({
        key: nextKey("media"),
        type: (item.kind === "video" ? "video" : "image") as ProjectMediaType,
        mediaId: item.id,
        media: item,
        youtubeUrl: "",
        title: item.originalName,
        alt: "",
      })),
    ]);
  }

  useEffect(() => {
    if (state.status === "success") router.push("/dashboard/portofolio");
  }, [state, router]);

  const imageMedia = useMemo(() => media.filter((item) => item.kind === "image"), [media]);

  function move(index: number, direction: -1 | 1) {
    setRows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  return (
    <form action={action} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="mediaCount" value={rows.length} />
      <input type="hidden" name="creditCount" value={credits.length} />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-1 block text-xs text-slate-600">
              Judul proyek
            </label>
            <input id="title" name="title" required defaultValue={project?.title ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-xs text-slate-600">
              Slug (opsional)
            </label>
            <input id="slug" name="slug" defaultValue={project?.slug ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-xs text-slate-600">
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={project?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="summary" className="mb-1 block text-xs text-slate-600">
              Ringkasan pendek
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={2}
              defaultValue={project?.summary ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Deskripsi lengkap</h2>
        <div className="mt-3">
          <RichTextEditor
            value={description}
            onChange={setDescription}
            onReady={(handle) => {
              descriptionHandle.current = handle;
            }}
            onOpenMediaLibrary={() => setDescriptionPickerOpen(true)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Media proyek</h2>
            <p className="text-xs text-slate-500">
              Urutan menentukan featured image. YouTube memakai thumbnail, video lokal memakai foto pertama.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className={`${buttonGhost} cursor-pointer`}>
              {uploading ? "Mengunggah…" : "Unggah berkas"}
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={(event) => {
                  uploadFiles(event.target.files);
                  event.target.value = "";
                }}
                className="sr-only"
              />
            </label>
            <button type="button" onClick={() => setPickerOpen(true)} className={buttonGhost}>
              Tambah dari pustaka
            </button>
            <button
              type="button"
              onClick={() =>
                setRows((current) => [
                  ...current,
                  {
                    key: nextKey("media"),
                    type: "youtube",
                    mediaId: null,
                    media: null,
                    youtubeUrl: "",
                    title: "",
                    alt: "",
                  },
                ])
              }
              className={buttonGhost}
            >
              Tambah YouTube
            </button>
          </div>
        </div>

        {uploadError ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{uploadError}</p>
        ) : null}

        {rows.length === 0 ? (
          <p className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
            Belum ada media.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {rows.map((row, index) => (
              <li key={row.key} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-start gap-3">
                  <input type="hidden" name={`media-${index}-type`} value={row.type} />
                  <input type="hidden" name={`media-${index}-mediaId`} value={row.mediaId ?? ""} />

                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-100">
                    {row.type === "youtube" ? (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-500">YouTube</div>
                    ) : row.media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.media.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-500">Hilang</div>
                    )}
                  </div>

                  <div className="grid min-w-[220px] flex-1 gap-2 sm:grid-cols-2">
                    <input
                      name={`media-${index}-title`}
                      value={row.title}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item) =>
                            item.key === row.key ? { ...item, title: event.target.value } : item
                          )
                        )
                      }
                      placeholder="Judul media"
                      className={inputClass}
                    />
                    <input
                      name={`media-${index}-alt`}
                      value={row.alt}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item) =>
                            item.key === row.key ? { ...item, alt: event.target.value } : item
                          )
                        )
                      }
                      placeholder="Alt text"
                      className={inputClass}
                    />
                    {row.type === "youtube" ? (
                      <input
                        name={`media-${index}-youtubeUrl`}
                        value={row.youtubeUrl}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((item) =>
                              item.key === row.key ? { ...item, youtubeUrl: event.target.value } : item
                            )
                          )
                        }
                        placeholder="https://youtu.be/…"
                        className={`${inputClass} sm:col-span-2`}
                      />
                    ) : (
                      <input type="hidden" name={`media-${index}-youtubeUrl`} value="" />
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(index, -1)} className={buttonGhost} aria-label="Naikkan">
                      ↑
                    </button>
                    <button type="button" onClick={() => move(index, 1)} className={buttonGhost} aria-label="Turunkan">
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Kredit produksi (opsional)</h2>
          <button
            type="button"
            onClick={() => setCredits((current) => [...current, { key: nextKey("credit"), label: "", value: "" }])}
            className={buttonGhost}
          >
            Tambah kredit
          </button>
        </div>

        {credits.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">Belum ada kredit.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {credits.map((credit, index) => (
              <li key={credit.key} className="flex flex-wrap gap-2">
                <input
                  name={`credit-${index}-label`}
                  value={credit.label}
                  onChange={(event) =>
                    setCredits((current) =>
                      current.map((item) =>
                        item.key === credit.key ? { ...item, label: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Peran, misal Director"
                  className={`${inputClass} max-w-xs`}
                />
                <input
                  name={`credit-${index}-value`}
                  value={credit.value}
                  onChange={(event) =>
                    setCredits((current) =>
                      current.map((item) =>
                        item.key === credit.key ? { ...item, value: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Nama"
                  className={`${inputClass} max-w-xs`}
                />
                <button
                  type="button"
                  onClick={() => setCredits((current) => current.filter((item) => item.key !== credit.key))}
                  className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
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

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Tambah media proyek"
        onSelect={(item) => {
          setRows((current) => [
            ...current,
            {
              key: nextKey("media"),
              type: item.kind === "video" ? "video" : "image",
              mediaId: item.id,
              media: item,
              youtubeUrl: "",
              title: item.originalName,
              alt: "",
            },
          ]);
          setPickerOpen(false);
        }}
      />

      <MediaPicker
        open={descriptionPickerOpen}
        onClose={() => setDescriptionPickerOpen(false)}
        title="Sisipkan gambar ke deskripsi"
        onSelect={(item) => {
          descriptionHandle.current?.insertContent(
            `<img src="${item.url}" alt="${item.originalName}" />`
          );
          setDescriptionPickerOpen(false);
        }}
      />

      {imageMedia.length === 0 ? (
        <p className="text-[11px] text-slate-500">
          Belum ada foto di pustaka. Unggah lewat menu Media agar bisa dipakai sebagai featured image.
        </p>
      ) : null}
    </form>
  );
}
