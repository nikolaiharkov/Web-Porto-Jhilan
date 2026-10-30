import { getDb, nowIso } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Article, ContentStatus, FeaturedMedia } from "@/lib/types";
import { mediaRepository } from "@/repositories/media.repository";

interface ArticleRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: number | null;
  featured_media_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: number | null;
  featuredMediaId: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  publishedAt: string | null;
}

function hydrate(row: ArticleRow): Article {
  const db = getDb();
  const category = row.category_id
    ? (db
        .prepare("SELECT id, name, slug FROM article_categories WHERE id = ?")
        .get(row.category_id) as { id: number; name: string; slug: string } | undefined)
    : undefined;

  const media = row.featured_media_id ? mediaRepository.findById(row.featured_media_id) : null;
  const featured: FeaturedMedia | null = media
    ? {
        kind: "image",
        url: `/media/${media.storagePath.split("/").map(encodeURIComponent).join("/")}`,
        youtubeId: null,
        alt: row.title,
      }
    : null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    categoryId: row.category_id,
    category: category ?? null,
    featuredMediaId: row.featured_media_id,
    featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const articleRepository = {
  slugExists(slug: string, excludeId?: number): boolean {
    const row = excludeId
      ? getDb().prepare("SELECT id FROM articles WHERE slug = ? AND id <> ?").get(slug, excludeId)
      : getDb().prepare("SELECT id FROM articles WHERE slug = ?").get(slug);
    return Boolean(row);
  },

  list(status?: ContentStatus): Article[] {
    const rows = (
      status
        ? getDb()
            .prepare("SELECT * FROM articles WHERE status = ? ORDER BY COALESCE(published_at, created_at) DESC")
            .all(status)
        : getDb()
            .prepare("SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC")
            .all()
    ) as ArticleRow[];
    return rows.map(hydrate);
  },

  findById(id: number): Article | null {
    const row = getDb().prepare("SELECT * FROM articles WHERE id = ?").get(id) as ArticleRow | undefined;
    return row ? hydrate(row) : null;
  },

  findBySlug(slug: string): Article | null {
    const row = getDb().prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as
      | ArticleRow
      | undefined;
    return row ? hydrate(row) : null;
  },

  create(input: CreateArticleInput): number {
    const now = nowIso();
    const result = getDb()
      .prepare(
        `INSERT INTO articles (title, slug, excerpt, content, category_id, featured_media_id, seo_title,
         seo_description, status, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        input.title,
        input.slug || slugify(input.title),
        input.excerpt,
        input.content,
        input.categoryId,
        input.featuredMediaId,
        input.seoTitle,
        input.seoDescription,
        input.status,
        input.publishedAt,
        now,
        now
      );
    return Number(result.lastInsertRowid);
  },

  update(id: number, input: CreateArticleInput): void {
    getDb()
      .prepare(
        `UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, category_id = ?,
         featured_media_id = ?, seo_title = ?, seo_description = ?, status = ?, published_at = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(
        input.title,
        input.slug || slugify(input.title),
        input.excerpt,
        input.content,
        input.categoryId,
        input.featuredMediaId,
        input.seoTitle,
        input.seoDescription,
        input.status,
        input.publishedAt,
        nowIso(),
        id
      );
  },

  delete(id: number): void {
    getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
  },

  countByStatus(): Record<ContentStatus | "all", number> {
    const rows = getDb()
      .prepare("SELECT status, COUNT(*) AS total FROM articles GROUP BY status")
      .all() as Array<{ status: ContentStatus; total: number }>;
    const result = { all: 0, draft: 0, published: 0 } as Record<ContentStatus | "all", number>;
    for (const row of rows) {
      result[row.status] = row.total;
      result.all += row.total;
    }
    return result;
  },
};
