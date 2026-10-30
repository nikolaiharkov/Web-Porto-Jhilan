"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction } from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import { SOCIAL_ICONS, resolveSocialIcon } from "@/lib/social-icons";
import type { SiteSettings } from "@/lib/types";

interface SocialRow {
  key: string;
  label: string;
  url: string;
  icon: string;
}

let counter = 0;

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, idleState);
  const [socials, setSocials] = useState<SocialRow[]>(
    settings.socials.map((social) => {
      counter += 1;
      return {
        key: `social-${counter}`,
        label: social.label,
        url: social.url,
        icon: resolveSocialIcon(social.icon),
      };
    })
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="socialCount" value={socials.length} />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Identitas</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="brandName" className="mb-1 block text-xs text-slate-600">
              Nama personal brand
            </label>
            <input id="brandName" name="brandName" defaultValue={settings.brandName} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="heroTitle" className="mb-1 block text-xs text-slate-600">
              Judul hero
            </label>
            <input id="heroTitle" name="heroTitle" defaultValue={settings.heroTitle} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="heroSubtitle" className="mb-1 block text-xs text-slate-600">
              Subjudul hero
            </label>
            <input id="heroSubtitle" name="heroSubtitle" defaultValue={settings.heroSubtitle} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Kontak</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="contactEmail" className="mb-1 block text-xs text-slate-600">
              Email
            </label>
            <input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail} className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactPhone" className="mb-1 block text-xs text-slate-600">
              Telepon
            </label>
            <input id="contactPhone" name="contactPhone" defaultValue={settings.contactPhone} className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactWhatsapp" className="mb-1 block text-xs text-slate-600">
              WhatsApp (format 62…)
            </label>
            <input
              id="contactWhatsapp"
              name="contactWhatsapp"
              defaultValue={settings.contactWhatsapp}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Tautan sosial</h2>
          <button
            type="button"
            onClick={() => {
              counter += 1;
              setSocials((current) => [
                ...current,
                { key: `social-${counter}`, label: "", url: "", icon: resolveSocialIcon(null) },
              ]);
            }}
            className={buttonGhost}
          >
            Tambah tautan
          </button>
        </div>

        {socials.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">Belum ada tautan sosial.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {socials.map((social, index) => (
              <li key={social.key} className="flex flex-wrap items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
                  <i className={resolveSocialIcon(social.icon)} aria-hidden="true" />
                </span>
                <select
                  name={`social-${index}-icon`}
                  value={social.icon}
                  onChange={(event) =>
                    setSocials((current) =>
                      current.map((item) =>
                        item.key === social.key ? { ...item, icon: event.target.value } : item
                      )
                    )
                  }
                  aria-label="Ikon"
                  className={`${inputClass} max-w-[11rem]`}
                >
                  {SOCIAL_ICONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  name={`social-${index}-label`}
                  value={social.label}
                  onChange={(event) =>
                    setSocials((current) =>
                      current.map((item) =>
                        item.key === social.key ? { ...item, label: event.target.value } : item
                      )
                    )
                  }
                  placeholder="Nama platform"
                  aria-label="Nama platform"
                  className={`${inputClass} max-w-[10rem]`}
                />
                <input
                  name={`social-${index}-url`}
                  value={social.url}
                  onChange={(event) =>
                    setSocials((current) =>
                      current.map((item) =>
                        item.key === social.key ? { ...item, url: event.target.value } : item
                      )
                    )
                  }
                  placeholder="https://…"
                  aria-label="URL"
                  className={`${inputClass} max-w-sm`}
                />
                <button
                  type="button"
                  onClick={() => setSocials((current) => current.filter((item) => item.key !== social.key))}
                  className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
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
        {pending ? "Menyimpan…" : "Simpan pengaturan"}
      </button>
    </form>
  );
}
