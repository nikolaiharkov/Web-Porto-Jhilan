import { getDb, nowIso } from "@/lib/db";
import type { MediaKind, MediaRecord } from "@/lib/types";

interface MediaRow {
  id: number;
  storage_path: string;
  kind: MediaKind;
  mime: string;
  original_name: string;
  byte_size: number;
  created_at: string;
}

function toRecord(row: MediaRow): MediaRecord {
  return {
    id: row.id,
    storagePath: row.storage_path,
    kind: row.kind,
    mime: row.mime,
    originalName: row.original_name,
    byteSize: row.byte_size,
    createdAt: row.created_at,
  };
}

export interface CreateMediaInput {
  storagePath: string;
  kind: MediaKind;
  mime: string;
  originalName: string;
  byteSize: number;
}

export const mediaRepository = {
  list(): MediaRecord[] {
    const rows = getDb().prepare("SELECT * FROM media ORDER BY created_at DESC, id DESC").all() as MediaRow[];
    return rows.map(toRecord);
  },

  findById(id: number): MediaRecord | null {
    const row = getDb().prepare("SELECT * FROM media WHERE id = ?").get(id) as MediaRow | undefined;
    return row ? toRecord(row) : null;
  },

  findByStoragePath(storagePath: string): MediaRecord | null {
    const row = getDb()
      .prepare("SELECT * FROM media WHERE storage_path = ?")
      .get(storagePath) as MediaRow | undefined;
    return row ? toRecord(row) : null;
  },

  create(input: CreateMediaInput): MediaRecord {
    const result = getDb()
      .prepare(
        "INSERT INTO media (storage_path, kind, mime, original_name, byte_size, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(input.storagePath, input.kind, input.mime, input.originalName, input.byteSize, nowIso());
    const row = getDb()
      .prepare("SELECT * FROM media WHERE id = ?")
      .get(Number(result.lastInsertRowid)) as MediaRow;
    return toRecord(row);
  },

  delete(id: number): void {
    getDb().prepare("DELETE FROM media WHERE id = ?").run(id);
  },

  usageFor(mediaId: number): Array<{ kind: "project" | "article" | "settings"; label: string; slug: string }> {
    const media = getDb().prepare("SELECT storage_path FROM media WHERE id = ?").get(mediaId) as
      | { storage_path: string }
      | undefined;

    if (!media) return [];

    const rows = getDb()
      .prepare(
        `SELECT 'project' AS kind, p.title AS label, p.slug AS slug
         FROM project_media pm JOIN projects p ON p.id = pm.project_id
         WHERE pm.media_id = ?
         UNION ALL
         SELECT 'article' AS kind, a.title AS label, a.slug AS slug
         FROM articles a WHERE a.featured_media_id = ?
         UNION ALL
         SELECT 'article' AS kind, a.title AS label, a.slug AS slug
         FROM articles a WHERE a.content LIKE ?
         UNION ALL
         SELECT 'settings' AS kind, 'Pengaturan situs' AS label, '' AS slug
         FROM site_settings s WHERE s.profile_media_id = ?`
      )
      .all(mediaId, mediaId, `%/media/${media.storage_path}%`, mediaId) as Array<{
      kind: "project" | "article" | "settings";
      label: string;
      slug: string;
    }>;

    const seen = new Set<string>();
    return rows.filter((row) => {
      const key = `${row.kind}:${row.slug}:${row.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};
