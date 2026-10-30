import { PageHeader } from "@/components/dashboard/ui";
import CategoryManager from "@/components/dashboard/category-manager";
import { articleCategoryRepository } from "@/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function ArticleCategoriesPage() {
  const categories = articleCategoryRepository.listWithCounts();

  return (
    <>
      <PageHeader
        title="Kategori Artikel"
        description="Kategori opsional untuk artikel. Menghapus kategori tidak menghapus artikel."
      />
      <CategoryManager categories={categories} kind="article" />
    </>
  );
}
