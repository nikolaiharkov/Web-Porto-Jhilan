import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/site/navbar";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import { CategoryFilterShell } from "@/components/site/category-filter";
import { JsonLd } from "@/components/site/json-ld";
import { projectRepository } from "@/repositories/project.repository";
import { portfolioCategoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portofolio",
  description: "Katalog karya fotografi, videografi, dan penyuntingan.",
  alternates: { canonical: "/portofolio" },
};

export default async function PortfolioPage() {
  const projects = projectRepository.list("published");
  const categories = portfolioCategoryRepository.list();
  const settings = settingsRepository.get();
  const origin = getAppUrl();

  const cards = projects.map((project) => ({
    categoryId: project.categoryId,
    node: (
      <Link
        key={project.id}
        href={`/portofolio/${project.slug}`}
        className="project-card group block overflow-hidden border border-white/10 bg-charcoal"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
          {project.featured ? (
            <Image
              src={project.featured.url}
              alt={project.featured.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
              Media belum tersedia
            </div>
          )}
        </div>
        <div className="p-5">
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-neonCyan">
            {project.category?.name ?? "Tanpa kategori"}
          </span>
          <h2 className="mt-2 font-display text-base font-semibold uppercase tracking-wide text-white">
            {project.title}
          </h2>
          {project.summary ? (
            <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-gray-500">{project.summary}</p>
          ) : null}
        </div>
      </Link>
    ),
  }));

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Beranda", path: "/" },
            { name: "Portofolio", path: "/portofolio" },
          ],
          origin
        )}
      />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
        <header className="mb-10">
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonCyan">
            Portofolio
          </span>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider md:text-5xl">
            Karya Pilihan
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Kumpulan proyek fotografi, videografi, dan penyuntingan yang telah dikerjakan.
          </p>
        </header>

        <CategoryFilterShell categories={categories} items={cards} />
      </section>

      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
