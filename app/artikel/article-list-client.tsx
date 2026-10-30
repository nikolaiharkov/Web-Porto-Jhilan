"use client";

import { useMemo, useState } from "react";
import { ArticleGrid } from "@/components/site/article-grid";
import { CategoryFilter } from "@/components/site/category-filter";
import type { Article, Category } from "@/lib/types";

export function ArticleListClient({
  categories,
  items,
}: {
  categories: Category[];
  items: Array<{ categoryId: number | null; article: Article }>;
}) {
  const [active, setActive] = useState<number | "all">("all");
  const usedCategories = useMemo(() => {
    const ids = new Set(items.map((item) => item.categoryId).filter((id): id is number => id !== null));
    return categories.filter((category) => ids.has(category.id));
  }, [categories, items]);

  const visible = active === "all" ? items : items.filter((item) => item.categoryId === active);

  return (
    <>
      <CategoryFilter categories={usedCategories} active={active} onChange={setActive} />
      <div className="mt-10">
        <ArticleGrid articles={visible.map((item) => item.article)} />
      </div>
    </>
  );
}
