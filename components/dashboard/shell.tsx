"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";

const NAV = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/portofolio", label: "Portofolio" },
  { href: "/dashboard/kategori-portofolio", label: "Kategori Portofolio" },
  { href: "/dashboard/artikel", label: "Artikel" },
  { href: "/dashboard/kategori-artikel", label: "Kategori Artikel" },
  { href: "/dashboard/media", label: "Media" },
  { href: "/dashboard/about", label: "About" },
  { href: "/dashboard/pengaturan", label: "Pengaturan Situs" },
  { href: "/dashboard/pengguna", label: "Pengguna" },
];

export default function DashboardShell({
  username,
  userCount,
  children,
}: {
  username: string;
  userCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="dashboard-nav"
            className="rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
          >
            <span className="sr-only">Buka navigasi</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M2 4h16v2H2V4Zm0 5h16v2H2V9Zm0 5h16v2H2v-2Z" />
            </svg>
          </button>
          <span className="text-sm font-semibold">CMS Portofolio</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="hidden sm:inline">{username}</span>
          <a href="/" target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Lihat situs
          </a>
          <form action={logoutAction}>
            <button type="submit" className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white">
              Keluar
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <nav
          id="dashboard-nav"
          className={`${open ? "block" : "hidden"} md:block md:w-56 md:shrink-0`}
          aria-label="Navigasi dashboard"
        >
          <ul className="space-y-1 rounded-lg border border-slate-200 bg-white p-2">
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                    {item.href === "/dashboard/pengguna" ? (
                      <span className="ml-1 text-[11px] opacity-60">({userCount})</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
