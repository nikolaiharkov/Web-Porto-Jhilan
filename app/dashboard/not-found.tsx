import { PageHeader } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default function DashboardNotFound() {
  return (
    <>
      <PageHeader title="Tidak ditemukan" description="Halaman dashboard ini tidak tersedia." />
      <a href="/dashboard" className="text-sm underline underline-offset-4">
        Kembali ke ringkasan
      </a>
    </>
  );
}
