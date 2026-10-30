import { getDb, nowIso } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export type CategoryTable = "portfolio_categories" | "article_categories";

function toCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug };
}

function table(name: CategoryTable) {
  return name;
}

export function createCategoryRepository(name: CategoryTable) {
  const t = table(name);

  return {
    list(): Category[] {
      const rows = getDb().prepare(`SELECT * FROM ${t} ORDER BY name ASC`).all() as CategoryRow[];
      return rows.map(toCategory);
    },

    listWithCounts(): Category[] {
      const rows = getDb()
        .prepare(
          t === "portfolio_categories"
            ? `SELECT c.*, (SELECT COUNT(*) FROM projects p WHERE p.category_id = c.id) AS total
               FROM portfolio_categories c ORDER BY c.name ASC`
            : `SELECT c.*, (SELECT COUNT(*) FROM articles a WHERE a.category_id = c.id) AS total
               FROM article_categories c ORDER BY c.name ASC`
        )
        .all() as Array<CategoryRow & { total: number }>;
      return rows.map((row) =>
        t === "portfolio_categories"
          ? { ...toCategory(row), projectCount: row.total }
          : { ...toCategory(row), articleCount: row.total }
      );
    },

    findById(id: number): Category | null {
      const row = getDb().prepare(`SELECT * FROM ${t} WHERE id = ?`).get(id) as CategoryRow | undefined;
      return row ? toCategory(row) : null;
    },

    findBySlug(slug: string): Category | null {
      const row = getDb().prepare(`SELECT * FROM ${t} WHERE slug = ?`).get(slug) as
        | CategoryRow
        | undefined;
      return row ? toCategory(row) : null;
    },

    create(name: string, slug?: string): Category {
      const finalSlug = slug?.trim() || slugify(name);
      const result = getDb()
        .prepare(`INSERT INTO ${t} (name, slug, created_at) VALUES (?, ?, ?)`)
        .run(name, finalSlug, nowIso());
      const row = getDb()
        .prepare(`SELECT * FROM ${t} WHERE id = ?`)
        .get(Number(result.lastInsertRowid)) as CategoryRow;
      return toCategory(row);
    },

    update(id: number, name: string, slug?: string): Category | null {
      const existing = getDb().prepare(`SELECT * FROM ${t} WHERE id = ?`).get(id) as
        | CategoryRow
        | undefined;
      if (!existing) return null;
      getDb()
        .prepare(`UPDATE ${t} SET name = ?, slug = ? WHERE id = ?`)
        .run(name, slug?.trim() || existing.slug, id);
      const row = getDb().prepare(`SELECT * FROM ${t} WHERE id = ?`).get(id) as CategoryRow;
      return toCategory(row);
    },

    delete(id: number): void {
      getDb().prepare(`DELETE FROM ${t} WHERE id = ?`).run(id);
    },

    usageCount(id: number): number {
      const row = getDb()
        .prepare(
          t === "portfolio_categories"
            ? "SELECT COUNT(*) AS total FROM projects WHERE category_id = ?"
            : "SELECT COUNT(*) AS total FROM articles WHERE category_id = ?"
        )
        .get(id) as { total: number };
      return row.total;
    },
  };
}

export const portfolioCategoryRepository = createCategoryRepository("portfolio_categories");
export const articleCategoryRepository = createCategoryRepository("article_categories");
