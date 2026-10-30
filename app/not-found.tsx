import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 text-center text-white">
      <p className="font-display text-[10px] uppercase tracking-[0.5em] text-neonCyan">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wider md:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-sm text-gray-500">
        Konten yang kamu cari tidak tersedia atau belum dipublikasikan.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="border border-neonCyan px-6 py-3 font-display text-[10px] uppercase tracking-[0.3em] text-neonCyan transition hover:bg-neonCyan hover:text-dark"
        >
          Beranda
        </Link>
        <Link
          href="/portofolio"
          className="border border-white/20 px-6 py-3 font-display text-[10px] uppercase tracking-[0.3em] text-gray-300 transition hover:border-white/50"
        >
          Portofolio
        </Link>
      </div>
    </main>
  );
}
