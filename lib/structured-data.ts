import type { Article, Project } from "@/lib/types";
import { formatDateId } from "@/lib/utils";

export function projectJsonLd(project: Project, origin: string): string {
  const url = `${origin}/portofolio/${project.slug}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary || project.title,
    url,
    datePublished: project.publishedAt ?? undefined,
    dateModified: project.updatedAt,
    genre: project.category?.name,
  };

  if (project.featured?.kind === "image") {
    data.image = project.featured.url.startsWith("http")
      ? project.featured.url
      : `${origin}${project.featured.url}`;
  }

  return JSON.stringify(data);
}

export function articleJsonLd(article: Article, brandName: string, origin: string): string {
  const url = `${origin}/artikel/${article.slug}`;
  const image = article.featured?.url
    ? article.featured.url.startsWith("http")
      ? article.featured.url
      : `${origin}${article.featured.url}`
    : undefined;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription ?? article.excerpt ?? article.title,
    image,
    url,
    mainEntityOfPage: url,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: brandName },
    publisher: { "@type": "Person", name: brandName },
    articleSection: article.category?.name,
  });
}

export function personJsonLd(args: {
  brandName: string;
  origin: string;
  description: string;
  image?: string | null;
  socials: Array<{ label: string; url: string }>;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${args.origin}/about`,
    mainEntity: {
      "@type": "Person",
      name: args.brandName,
      description: args.description,
      image: args.image ? (args.image.startsWith("http") ? args.image : `${args.origin}${args.image}`) : undefined,
      sameAs: args.socials.map((social) => social.url),
    },
  });
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>, origin: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  });
}

export function visibleDate(iso: string | null): string {
  return formatDateId(iso);
}
