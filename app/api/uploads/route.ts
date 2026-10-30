import { requireUser } from "@/lib/session";
import { MediaError, mediaService } from "@/services/media.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireUser();
  } catch {
    return Response.json({ error: { message: "Tidak terautentikasi", code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return Response.json({ error: { message: "Body bukan multipart", code: "BAD_REQUEST" } }, { status: 400 });
  }

  const files = form.getAll("file").filter((entry): entry is File => entry instanceof File);
  if (files.length === 0) {
    return Response.json({ error: { message: "Tidak ada berkas", code: "NO_FILE" } }, { status: 400 });
  }

  try {
    const data = await mediaService.saveFiles(files);
    return Response.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof MediaError) {
      return Response.json({ error: { message: error.message, code: error.code } }, { status: 400 });
    }
    console.error("[api/uploads]", error);
    return Response.json({ error: { message: "Gagal menyimpan berkas", code: "WRITE_FAILED" } }, { status: 500 });
  }
}
