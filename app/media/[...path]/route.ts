import path from "node:path";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { getEnv } from "@/lib/env";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = await params;
  const parts = segments.path ?? [];

  if (parts.length === 0) {
    return new Response(null, { status: 404 });
  }

  for (const part of parts) {
    if (part.includes("..") || part.includes("\\") || part.includes("/")) {
      return new Response(null, { status: 400 });
    }
  }

  const relative = parts.join("/");
  const extension = path.extname(relative).toLowerCase();
  const mime = MIME_BY_EXT[extension];

  if (!mime) {
    return new Response(null, { status: 400 });
  }

  const base = path.resolve(getEnv().mediaDir);
  const absolute = path.resolve(base, relative);

  if (!absolute.startsWith(base + path.sep)) {
    return new Response(null, { status: 400 });
  }

  const info = await stat(absolute).catch(() => null);
  if (!info || !info.isFile()) {
    return new Response(null, { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(absolute)) as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(info.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
