import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import ProjectForm from "../project-form";
import { projectRepository } from "@/repositories/project.repository";
import { portfolioCategoryRepository } from "@/repositories/category.repository";
import { mediaService } from "@/services/media.service";

export const dynamic = "force-dynamic";

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "baru";
  const project = isNew ? null : projectRepository.findById(Number(id));
  if (!isNew && !project) notFound();

  const categories = portfolioCategoryRepository.list();
  const media = mediaService.list();

  return (
    <>
      <PageHeader
        title={isNew ? "Proyek baru" : "Ubah proyek"}
        description="Atur kategori, media, dan urutan tampil. Draft tidak tampil di situs publik."
      />
      <ProjectForm project={project} categories={categories} media={media} />
    </>
  );
}
