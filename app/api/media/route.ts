import { requireUser } from "@/lib/session";
import { mediaService } from "@/services/media.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireUser();
  } catch {
    return Response.json({ error: { message: "Tidak terautentikasi", code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").toLowerCase();
  const kind = url.searchParams.get("kind");

  let data = mediaService.list();
  if (kind === "image" || kind === "video") {
    data = data.filter((media) => media.kind === kind);
  }
  if (query) {
    data = data.filter((media) => media.originalName.toLowerCase().includes(query));
  }

  return Response.json({ data }, { headers: { "Cache-Control": "no-store" } });
}
