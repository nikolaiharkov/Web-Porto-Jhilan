"use client";

import { useActionState } from "react";
import { saveAboutAction } from "@/app/dashboard/pengaturan/actions";
import { idleState } from "@/lib/action-state";
import { buttonPrimary, inputClass } from "@/components/dashboard/ui";
import ArticleEditor from "@/components/dashboard/article-editor";
import ProfilePicker from "@/components/dashboard/profile-picker";
import type { MediaWithUrl, SiteSettings } from "@/lib/types";

export default function AboutForm({
  settings,
  media,
}: {
  settings: SiteSettings;
  media: MediaWithUrl[];
}) {
  const [state, action, pending] = useActionState(saveAboutAction, idleState);

  return (
    <form action={action} className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Ringkasan beranda</h2>
        <textarea
          name="aboutShort"
          rows={4}
          defaultValue={settings.aboutShort}
          className={`${inputClass} mt-3`}
          placeholder="Ringkasan singkat yang tampil di beranda."
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Foto profil</h2>
        <p className="mt-1 text-xs text-slate-500">
          Dipakai pada halaman About, brand image, dan metadata sosial.
        </p>
        <div className="mt-3">
          <ProfilePicker media={media} defaultValue={settings.profileMediaId} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Isi About lengkap</h2>
        <div className="mt-3">
          <ArticleEditor name="aboutFull" defaultValue={settings.aboutFull} label="Isi" />
        </div>
      </section>

      {state.status !== "idle" && state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-xs ${
            state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Menyimpan…" : "Simpan About"}
      </button>
    </form>
  );
}
