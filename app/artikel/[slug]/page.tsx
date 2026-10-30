import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/site/navbar";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { articleRepository } from "@/repositories/article.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";
import { formatDateId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articleRepository.findBySlug(slug);
  if (!article || article.status !== "published") {
    return { title: "Tidak ditemukan", robots: { index: false } };
  }

  const origin = getAppUrl();
  const image = article.featured
    ? article.featured.url.startsWith("http")
      ? article.featured.url
      : `${origin}${article.featured.url}`
    : undefined;

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
      url: `${origin}/artikel/${article.slug}`,
      images: image ? [{ url: image, alt: article.title }] : undefined,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleRepository.findBySlug(slug);
  if (!article || article.status !== "published") notFound();

  const settings = settingsRepository.get();
  const origin = getAppUrl();

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <JsonLd data={articleJsonLd(article, settings.brandName, origin)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Beranda", path: "/" },
            { name: "Artikel", path: "/artikel" },
            { name: article.title, path: `/artikel/${article.slug}` },
          ],
          origin
        )}
      />

      <Navbar />

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-8">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 font-display text-[10px] uppercase tracking-[0.3em] text-gray-500">
            {article.category ? <span className="text-neonCyan">{article.category.name}</span> : null}
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt ?? undefined}>{formatDateId(article.publishedAt)}</time>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-wider md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">{article.excerpt}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-gray-500">
            Oleh {settings.brandName}
          </p>
        </header>

        {article.featured ? (
          <div className="mb-10 overflow-hidden border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.featured.url}
              alt={article.featured.alt || article.title}
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <div
          className="space-y-4 text-sm leading-relaxed text-gray-300 md:text-base [&_a]:text-neonCyan [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-neonCyan [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-white [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-white [&_img]:my-6 [&_img]:w-full [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_pre]:overflow-x-auto [&_pre]:bg-black/60 [&_pre]:p-4 [&_table]:w-full [&_td]:border [&_td]:border-white/10 [&_td]:p-2 [&_th]:border [&_th]:border-white/10 [&_th]:p-2"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="mt-16 border-t border-white/5 pt-8">
          <Link
            href="/artikel"
            className="font-display text-[11px] uppercase tracking-[0.3em] text-gray-400 underline decoration-white/20 underline-offset-8 transition hover:text-neonCyan"
          >
            ← Kembali ke daftar artikel
          </Link>
        </footer>
      </article>

      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
