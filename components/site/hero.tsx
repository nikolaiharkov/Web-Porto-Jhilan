import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] w-full overflow-hidden bg-dark font-body text-white"
    >
      <div className="pointer-events-none absolute right-[-10%] top-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-gradient-to-br from-neonCyan via-transparent to-transparent opacity-20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-30%] z-0 h-[60%] w-[60%] rounded-full bg-gradient-to-tr from-neonMagenta via-transparent to-transparent opacity-20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center md:px-12">
        <div className="relative mb-10">
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] tracking-[0.5em] text-gray-500 uppercase">
            Seni Visual / Pascaproduksi
          </span>
          <h1 className="glitch relative mb-2 font-display text-4xl font-bold uppercase tracking-tighter sm:text-6xl md:text-8xl" data-text={settings.heroTitle}>
            {settings.heroTitle}
          </h1>
          <p className="font-display text-xs font-light uppercase tracking-[0.25em] text-neonCyan md:text-lg">
            {settings.heroSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/portofolio"
            className="group mb-4 flex items-center gap-3 border border-neonCyan px-10 py-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-neonCyan transition-all duration-300 hover:bg-neonCyan hover:text-dark"
          >
            Lihat Portofolio
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/artikel"
            className="mb-4 border border-white/20 px-8 py-4 font-display text-xs uppercase tracking-[0.3em] text-gray-300 transition hover:border-white/50 hover:text-white"
          >
            Baca Artikel
          </Link>
        </div>
      </div>

      <div className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-16 text-[10px] uppercase tracking-[0.5em] text-gray-700 md:flex">
        <div className="flex flex-col items-center gap-5">
          <i className="fa-solid fa-chevron-down animate-bounce text-xs" aria-hidden="true" />
          <div className="h-20 w-px bg-gradient-to-b from-gray-800 via-transparent to-gray-800" />
          <span className="font-display text-xs font-semibold tracking-[0.3em] text-gray-800">GULIR</span>
        </div>
      </div>
    </section>
  );
}
