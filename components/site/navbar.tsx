import Link from "next/link";
import { siteSettings } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/artikel", label: "Artikel" },
  { href: "/#contact", label: "Kontak" },
];

export default async function Navbar() {
  const settings = await siteSettings();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 glass-panel px-6 py-4 md:px-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-widest text-white transition hover:text-neonCyan"
        >
          JAF<span className="text-neonCyan">.</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-400 transition hover:text-neonCyan"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none text-white" aria-label="Buka menu">
            <i className="fa-solid fa-bars text-xl" aria-hidden="true" />
          </summary>
          <nav
            aria-label="Navigasi seluler"
            className="absolute right-0 mt-3 w-44 rounded-md border border-white/10 bg-charcoal/95 p-3 text-xs uppercase tracking-[0.2em]"
          >
            <ul className="space-y-3 text-gray-300">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block hover:text-neonCyan">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>

      <span className="sr-only">{settings.brandName}</span>
    </header>
  );
}
