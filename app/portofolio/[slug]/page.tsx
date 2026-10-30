import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/site/navbar";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import MediaGallery from "@/components/site/media-gallery";
import { JsonLd } from "@/components/site/json-ld";
import { projectRepository } from "@/repositories/project.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";
import { formatDateId } from "@/lib/utils";
import { mediaUrl } from "@/services/media.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectRepository.findBySlug(slug);
  if (!project || project.status !== "published") return { title: "Tidak ditemukan", robots: { index: false } };

  const origin = getAppUrl();
  const image = project.featured
    ? project.featured.url.startsWith("http")
      ? project.featured.url
      : `${origin}${project.featured.url}`
    : undefined;

  return {
    title: project.title,
    description: project.summary || project.title,
    alternates: { canonical: `/portofolio/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary || project.title,
      url: `${origin}/portofolio/${project.slug}`,
      images: image ? [{ url: image, alt: project.featured?.alt || project.title }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectRepository.findBySlug(slug);
  if (!project || project.status !== "published") notFound();

  const settings = settingsRepository.get();
  const origin = getAppUrl();

  const gallery = project.media.map((item) => ({
    id: item.id ?? item.position,
    type: item.type,
    url: item.media ? mediaUrl(item.media.storagePath) : null,
    youtubeId: item.youtubeId,
    title: item.title,
    alt: item.alt,
  }));

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <JsonLd data={projectJsonLd(project, origin)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Beranda", path: "/" },
            { name: "Portofolio", path: "/portofolio" },
            { name: project.title, path: `/portofolio/${project.slug}` },
          ],
          origin
        )}
      />

      <Navbar />

      <article className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-12">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 font-display text-[10px] uppercase tracking-[0.3em] text-gray-500">
            <span className="text-neonCyan">{project.category?.name ?? "Tanpa kategori"}</span>
            {project.publishedAt ? (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={project.publishedAt}>{formatDateId(project.publishedAt)}</time>
              </>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wider md:text-5xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">{project.summary}</p>
          ) : null}
        </header>

        {project.featured ? (
          <div className="relative mb-10 aspect-video w-full overflow-hidden border border-white/10 bg-black">
            {project.featured.kind === "youtube" ? (
              <img
                src={project.featured.url}
                alt={project.featured.alt || project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={project.featured.url}
                alt={project.featured.alt || project.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            )}
          </div>
        ) : null}

        {project.credits.length > 0 ? (
          <dl className="mb-10 grid gap-3 border-y border-white/5 py-6 sm:grid-cols-2">
            {project.credits.map((credit) => (
              <div key={`${credit.label}-${credit.value}`} className="flex justify-between gap-4 text-xs">
                <dt className="uppercase tracking-[0.2em] text-gray-500">{credit.label}</dt>
                <dd className="text-gray-200">{credit.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div
          className="mb-12 max-w-2xl space-y-4 text-sm leading-relaxed text-gray-300 [&_a]:text-neonCyan [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-base [&_h3]:text-white [&_img]:my-6 [&_img]:w-full [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        <h2 className="mb-4 font-display text-xs uppercase tracking-[0.4em] text-gray-500">Galeri</h2>
        <MediaGallery items={gallery} />
      </article>

      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
