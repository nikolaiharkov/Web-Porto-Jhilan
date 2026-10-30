import Link from "next/link";
import { EmptyState, PageHeader, buttonPrimary } from "@/components/dashboard/ui";
import ArticleTable from "./article-table";
import { articleRepository } from "@/repositories/article.repository";
import { articleCategoryRepository } from "@/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function ArticleListPage() {
  const articles = articleRepository.list();
  const categories = articleCategoryRepository.list();

  return (
    <>
      <PageHeader
        title="Artikel"
        description="Kelola artikel blog. Draft tidak muncul di katalog publik maupun sitemap."
        action={
          <Link href="/dashboard/artikel/baru" className={buttonPrimary}>
            Tambah artikel
          </Link>
        }
      />

      {articles.length === 0 ? (
        <EmptyState
          message="Belum ada artikel."
          action={
            <Link href="/dashboard/artikel/baru" className={buttonPrimary}>
              Tulis artikel pertama
            </Link>
          }
        />
      ) : (
        <ArticleTable articles={articles} categories={categories} />
      )}
    </>
  );
}
