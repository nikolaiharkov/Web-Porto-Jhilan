import { PageHeader } from "@/components/dashboard/ui";
import AboutForm from "./about-form";
import { settingsRepository } from "@/repositories/settings.repository";
import { mediaService } from "@/services/media.service";

export const dynamic = "force-dynamic";

export default async function AboutSettingsPage() {
  const settings = settingsRepository.get();
  const media = mediaService.list().filter((item) => item.kind === "image");

  return (
    <>
      <PageHeader
        title="About"
        description="Ringkasan beranda, foto profil, dan isi halaman About."
      />
      <AboutForm settings={settings} media={media} />
    </>
  );
}
