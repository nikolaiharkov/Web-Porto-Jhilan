import Link from "next/link";
import { EmptyState, PageHeader, buttonPrimary } from "@/components/dashboard/ui";
import ProjectTable from "./project-table";
import { projectRepository } from "@/repositories/project.repository";
import { portfolioCategoryRepository } from "@/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function PortfolioListPage() {
  const projects = projectRepository.list();
  const categories = portfolioCategoryRepository.list();

  return (
    <>
      <PageHeader
        title="Portofolio"
        description="Kelola proyek beserta media campuran dan urutan tampilnya."
        action={
          <Link href="/dashboard/portofolio/baru" className={buttonPrimary}>
            Tambah proyek
          </Link>
        }
      />

      {categories.length === 0 ? (
        <div className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Buat kategori portofolio terlebih dahulu sebelum menambah proyek.{" "}
          <Link href="/dashboard/kategori-portofolio" className="underline">
            Kelola kategori
          </Link>
        </div>
      ) : null}

      {projects.length === 0 ? (
        <EmptyState
          message="Belum ada proyek."
          action={
            <Link href="/dashboard/portofolio/baru" className={buttonPrimary}>
              Tambah proyek pertama
            </Link>
          }
        />
      ) : (
        <ProjectTable projects={projects} />
      )}
    </>
  );
}
