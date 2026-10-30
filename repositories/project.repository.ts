import { getDb, nowIso } from "@/lib/db";
import { parseJsonArray, slugify } from "@/lib/utils";
import type {
  Credit,
  Project,
  ProjectMediaInput,
  ProjectMediaItem,
  ProjectMediaType,
  ContentStatus,
  FeaturedMedia,
} from "@/lib/types";
import { mediaRepository } from "@/repositories/media.repository";

interface ProjectRow {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  summary: string;
  description: string;
  credits: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectMediaRow {
  id: number;
  project_id: number;
  media_id: number | null;
  type: ProjectMediaType;
  youtube_url: string | null;
  youtube_id: string | null;
  title: string;
  alt: string;
  position: number;
}

export interface CreateProjectInput {
  title: string;
  slug: string;
  categoryId: number;
  summary: string;
  description: string;
  credits: Credit[];
  status: ContentStatus;
  publishedAt: string | null;
  media: ProjectMediaInput[];
}

function mediaUrl(storagePath: string): string {
  return `/media/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
}

export function resolveProjectFeatured(items: ProjectMediaItem[]): FeaturedMedia | null {
  const ordered = [...items].sort((a, b) => a.position - b.position);

  for (const item of ordered) {
    if (item.type === "image" && item.media) {
      return {
        kind: "image",
        url: item.media.url,
        youtubeId: null,
        alt: item.alt || item.title || "",
      };
    }
    if (item.type === "youtube" && item.youtubeId) {
      return {
        kind: "youtube",
        url: `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`,
        youtubeId: item.youtubeId,
        alt: item.alt || item.title || "",
      };
    }
  }

  const firstImage = ordered.find((item) => item.type === "image" && item.media);
  if (firstImage?.media) {
    return {
      kind: "image",
      url: firstImage.media.url,
      youtubeId: null,
      alt: firstImage.alt || firstImage.title || "",
    };
  }

  return null;
}

function hydrateMedia(row: ProjectMediaRow): ProjectMediaItem {
  const media = row.media_id ? mediaRepository.findById(row.media_id) : null;
  return {
    id: row.id,
    type: row.type,
    mediaId: row.media_id,
    media: media ? { ...media, url: mediaUrl(media.storagePath) } : null,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
    title: row.title,
    alt: row.alt,
    position: row.position,
  };
}

function hydrate(row: ProjectRow): Project {
  const db = getDb();
  const mediaRows = db
    .prepare("SELECT * FROM project_media WHERE project_id = ? ORDER BY position ASC, id ASC")
    .all(row.id) as ProjectMediaRow[];
  const category = db
    .prepare("SELECT id, name, slug FROM portfolio_categories WHERE id = ?")
    .get(row.category_id) as { id: number; name: string; slug: string } | undefined;

  const media = mediaRows.map(hydrateMedia);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.category_id,
    category: category ?? null,
    summary: row.summary,
    description: row.description,
    credits: parseJsonArray<Credit>(row.credits),
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    media,
    featured: resolveProjectFeatured(media),
  };
}

export const projectRepository = {
  slugExists(slug: string, excludeId?: number): boolean {
    const row = excludeId
      ? getDb().prepare("SELECT id FROM projects WHERE slug = ? AND id <> ?").get(slug, excludeId)
      : getDb().prepare("SELECT id FROM projects WHERE slug = ?").get(slug);
    return Boolean(row);
  },

  list(status?: ContentStatus): Project[] {
    const rows = (
      status
        ? getDb()
            .prepare("SELECT * FROM projects WHERE status = ? ORDER BY COALESCE(published_at, created_at) DESC")
            .all(status)
        : getDb()
            .prepare("SELECT * FROM projects ORDER BY COALESCE(published_at, created_at) DESC")
            .all()
    ) as ProjectRow[];
    return rows.map(hydrate);
  },

  findById(id: number): Project | null {
    const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow | undefined;
    return row ? hydrate(row) : null;
  },

  findBySlug(slug: string): Project | null {
    const row = getDb().prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as
      | ProjectRow
      | undefined;
    return row ? hydrate(row) : null;
  },

  create(input: CreateProjectInput): number {
    const db = getDb();
    const now = nowIso();
    const createTx = db.transaction((data: CreateProjectInput) => {
      const result = db
        .prepare(
          `INSERT INTO projects (title, slug, category_id, summary, description, credits, status, published_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          data.title,
          data.slug || slugify(data.title),
          data.categoryId,
          data.summary,
          data.description,
          JSON.stringify(data.credits),
          data.status,
          data.publishedAt,
          now,
          now
        );
      const projectId = Number(result.lastInsertRowid);
      const insertMedia = db.prepare(
        `INSERT INTO project_media (project_id, media_id, type, youtube_url, youtube_id, title, alt, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      data.media.forEach((item, index) => {
        insertMedia.run(
          projectId,
          item.mediaId,
          item.type,
          item.youtubeUrl,
          item.youtubeId,
          item.title,
          item.alt,
          index
        );
      });
      return projectId;
    });
    return createTx(input);
  },

  update(id: number, input: CreateProjectInput): void {
    const db = getDb();
    const now = nowIso();
    const updateTx = db.transaction((data: CreateProjectInput) => {
      db.prepare(
        `UPDATE projects SET title = ?, slug = ?, category_id = ?, summary = ?, description = ?,
         credits = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?`
      ).run(
        data.title,
        data.slug || slugify(data.title),
        data.categoryId,
        data.summary,
        data.description,
        JSON.stringify(data.credits),
        data.status,
        data.publishedAt,
        now,
        id
      );
      db.prepare("DELETE FROM project_media WHERE project_id = ?").run(id);
      const insertMedia = db.prepare(
        `INSERT INTO project_media (project_id, media_id, type, youtube_url, youtube_id, title, alt, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      data.media.forEach((item, index) => {
        insertMedia.run(id, item.mediaId, item.type, item.youtubeUrl, item.youtubeId, item.title, item.alt, index);
      });
    });
    updateTx(input);
  },

  delete(id: number): void {
    getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  },

  countByStatus(): Record<ContentStatus | "all", number> {
    const rows = getDb()
      .prepare("SELECT status, COUNT(*) AS total FROM projects GROUP BY status")
      .all() as Array<{ status: ContentStatus; total: number }>;
    const result = { all: 0, draft: 0, published: 0 } as Record<ContentStatus | "all", number>;
    for (const row of rows) {
      result[row.status] = row.total;
      result.all += row.total;
    }
    return result;
  },
};
