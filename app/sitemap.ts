import type { MetadataRoute } from "next";
import { projectRepository } from "@/repositories/project.repository";
import { articleRepository } from "@/repositories/article.repository";
import { getAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAppUrl();
  const projects = projectRepository.list("published");
  const articles = articleRepository.list("published");

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/portofolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/artikel`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${origin}/portofolio/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${origin}/artikel/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...articleEntries];
}
