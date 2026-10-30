import { PageHeader } from "@/components/dashboard/ui";
import SettingsForm from "./settings-form";
import { settingsRepository } from "@/repositories/settings.repository";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = settingsRepository.get();

  return (
    <>
      <PageHeader
        title="Pengaturan Situs"
        description="Hero, identitas brand, kontak, dan tautan sosial. Tema dan layout tidak dapat diubah dari sini."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
