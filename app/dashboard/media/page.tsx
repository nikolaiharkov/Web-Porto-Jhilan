import { PageHeader } from "@/components/dashboard/ui";
import { mediaService } from "@/services/media.service";
import MediaManager from "./media-manager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = mediaService.list().map((media) => ({
    ...media,
    usage: mediaService.usage(media.id),
  }));

  return (
    <>
      <PageHeader
        title="Media"
        description="Pustaka terpusat untuk foto dan video. Media yang masih dipakai konten tetap bisa dihapus, konten akan menampilkan placeholder."
      />
      <MediaManager initial={items} />
    </>
  );
}
