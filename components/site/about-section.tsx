import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { resolveSocialIcon } from "@/lib/social-icons";

export default function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="about" className="relative w-full border-y border-white/5 bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="relative flex justify-center md:col-span-5">
            <div className="absolute h-64 w-64 rounded-full bg-gradient-to-tr from-neonCyan to-neonMagenta opacity-20 blur-2xl md:h-80 md:w-80" />
            <div className="relative h-64 w-64 rounded-full bg-gradient-to-tr from-neonCyan via-transparent to-neonMagenta p-[3px] md:h-80 md:w-80">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-dark">
                {settings.profileMedia ? (
                  <Image
                    src={settings.profileMedia.url}
                    alt={`Foto profil ${settings.brandName}`}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-gray-600">
                    Foto profil
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-7">
            <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonCyan">
              Tentang Saya
            </span>
            <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
              Di Balik Lensa
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-gray-400 md:text-base">
              {settings.aboutShort || "Profil singkat belum diisi dari dashboard."}
            </p>

            <div className="my-8 h-px w-16 bg-white/10" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gray-500">
                Tautan sosial:
              </span>
              <div className="flex flex-wrap gap-5 text-lg text-gray-400">
                {settings.socials.length === 0 ? (
                  <span className="text-xs text-gray-600">Belum ada tautan sosial.</span>
                ) : (
                  settings.socials.map((social) => (
                    <a
                      key={`${social.label}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                      aria-label={social.label}
                      className="transition duration-300 hover:text-neonCyan"
                    >
                      <i className={resolveSocialIcon(social.icon)} aria-hidden="true" />
                    </a>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/about"
              className="mt-8 inline-block font-display text-[11px] uppercase tracking-[0.3em] text-gray-400 underline decoration-white/20 underline-offset-8 transition hover:text-neonCyan"
            >
              Baca profil lengkap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
