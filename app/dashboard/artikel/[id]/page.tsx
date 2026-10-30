import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import ArticleForm from "../article-form";
import { articleRepository } from "@/repositories/article.repository";
import { articleCategoryRepository } from "@/repositories/category.repository";
import { mediaService } from "@/services/media.service";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "baru";

  const article = isNew ? null : articleRepository.findById(Number(id));
  if (!isNew && !article) notFound();

  const categories = articleCategoryRepository.list();
  const media = mediaService.list().filter((item) => item.kind === "image");

  return (
    <>
      <PageHeader
        title={isNew ? "Artikel baru" : "Ubah artikel"}
        description="Isi ringkasan, konten, dan media. Status draft tidak tampil di situs publik."
      />
      <ArticleForm article={article} categories={categories} media={media} />
    </>
  );
}
