"use client";

import Link from "next/link";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 text-center text-white">
      <p className="font-display text-[10px] uppercase tracking-[0.5em] text-neonMagenta">Kesalahan</p>
      <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wider md:text-3xl">
        Terjadi kesalahan
      </h1>
      <p className="mt-4 max-w-md text-sm text-gray-500">
        Halaman gagal dimuat. Coba muat ulang, atau kembali ke beranda.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-white/20 px-6 py-3 font-display text-[10px] uppercase tracking-[0.3em] text-gray-200"
        >
          Muat ulang
        </button>
        <Link
          href="/"
          className="border border-neonCyan px-6 py-3 font-display text-[10px] uppercase tracking-[0.3em] text-neonCyan"
        >
          Beranda
        </Link>
      </div>
    </main>
  );
}
