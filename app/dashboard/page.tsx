import Link from "next/link";
import { Card, PageHeader, Stat } from "@/components/dashboard/ui";
import { projectRepository } from "@/repositories/project.repository";
import { articleRepository } from "@/repositories/article.repository";
import { mediaRepository } from "@/repositories/media.repository";
import { userRepository } from "@/repositories/user.repository";
import { settingsRepository } from "@/repositories/settings.repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  const projects = projectRepository.countByStatus();
  const articles = articleRepository.countByStatus();
  const media = mediaRepository.list();
  const users = userRepository.count();
  const settings = settingsRepository.get();

  return (
    <>
      <PageHeader
        title="Ringkasan"
        description="Status konten dan konfigurasi situs saat ini."
      />

      {notice === "default-password" ? (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Password akun ini masih default.</p>
          <p className="mt-1 text-xs">
            Segera ganti lewat{" "}
            <Link href="/dashboard/pengguna" className="underline underline-offset-2">
              menu Pengguna
            </Link>
            . Peringatan ini tidak menghalangi penggunaan dashboard.
          </p>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Proyek terbit" value={projects.published} />
        <Stat label="Artikel terbit" value={articles.published} />
        <Stat label="Berkas media" value={media.length} />
        <Stat label="Akun" value={users} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Draft</h2>
          <p className="mt-2 text-sm text-slate-600">
            {projects.draft} proyek dan {articles.draft} artikel belum diterbitkan.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/dashboard/portofolio"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
            >
              Kelola portofolio
            </Link>
            <Link
              href="/dashboard/artikel"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
            >
              Kelola artikel
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Identitas situs</h2>
          <dl className="mt-3 space-y-1 text-sm text-slate-600">
            <div className="flex justify-between gap-4">
              <dt>Nama brand</dt>
              <dd className="font-medium text-slate-900">{settings.brandName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Foto profil</dt>
              <dd className="font-medium text-slate-900">{settings.profileMedia ? "Terpasang" : "Belum ada"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Tautan sosial</dt>
              <dd className="font-medium text-slate-900">{settings.socials.length}</dd>
            </div>
          </dl>
          <Link
            href="/dashboard/pengaturan"
            className="mt-4 inline-block rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
          >
            Ubah pengaturan
          </Link>
        </Card>
      </div>
    </>
  );
}
