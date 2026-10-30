import type { Metadata } from "next";
import Navbar from "@/components/site/navbar";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import { ArticleGrid } from "@/components/site/article-grid";
import { JsonLd } from "@/components/site/json-ld";
import { articleRepository } from "@/repositories/article.repository";
import { articleCategoryRepository } from "@/repositories/category.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";
import { ArticleListClient } from "./article-list-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Catatan proses, pemikiran, dan cerita di balik karya.",
  alternates: { canonical: "/artikel" },
};

export default async function ArticleIndexPage() {
  const articles = articleRepository.list("published");
  const categories = articleCategoryRepository.list();
  const settings = settingsRepository.get();
  const origin = getAppUrl();

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Beranda", path: "/" },
            { name: "Artikel", path: "/artikel" },
          ],
          origin
        )}
      />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
        <header className="mb-10">
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonMagenta">Jurnal</span>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider md:text-5xl">Artikel</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Catatan proses produksi, pemikiran visual, dan cerita di balik karya.
          </p>
        </header>

        {articles.length === 0 ? (
          <ArticleGrid articles={[]} />
        ) : (
          <ArticleListClient
            categories={categories}
            items={articles.map((article) => ({ categoryId: article.categoryId, article }))}
          />
        )}
      </section>

      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
