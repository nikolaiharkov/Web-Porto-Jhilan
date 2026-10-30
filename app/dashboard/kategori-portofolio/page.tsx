import { PageHeader } from "@/components/dashboard/ui";
import CategoryManager from "@/components/dashboard/category-manager";
import { portfolioCategoryRepository } from "@/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function PortfolioCategoriesPage() {
  const categories = portfolioCategoryRepository.listWithCounts();

  return (
    <>
      <PageHeader
        title="Kategori Portofolio"
        description="Setiap proyek memakai satu kategori. Kategori yang masih dipakai tidak dapat dihapus."
      />
      <CategoryManager categories={categories} kind="portfolio" />
    </>
  );
}
