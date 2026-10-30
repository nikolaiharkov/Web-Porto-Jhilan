import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getEnv } from "@/lib/env";
import { mediaRepository } from "@/repositories/media.repository";
import type { MediaKind, MediaWithUrl } from "@/lib/types";

const IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const VIDEO_TYPES = new Map<string, string>([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

export class MediaError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

function extensionFor(mime: string): { ext: string; kind: MediaKind } | null {
  const image = IMAGE_TYPES.get(mime);
  if (image) return { ext: image, kind: "image" };
  const video = VIDEO_TYPES.get(mime);
  if (video) return { ext: video, kind: "video" };
  return null;
}

function detectMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  if (
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    if (brand.startsWith("qt")) return "video/mp4";
    return "video/mp4";
  }
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return "video/webm";
  }
  return null;
}

export function mediaUrl(storagePath: string): string {
  return `/media/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
}

export function withUrl<T extends { storagePath: string }>(record: T): T & { url: string } {
  return { ...record, url: mediaUrl(record.storagePath) };
}

export const mediaService = {
  list(): MediaWithUrl[] {
    return mediaRepository.list().map(withUrl);
  },

  findById(id: number): MediaWithUrl | null {
    const record = mediaRepository.findById(id);
    return record ? withUrl(record) : null;
  },

  usage(mediaId: number) {
    return mediaRepository.usageFor(mediaId);
  },

  async saveFiles(files: File[]): Promise<MediaWithUrl[]> {
    const env = getEnv();
    const saved: MediaWithUrl[] = [];

    for (const file of files) {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const detected = detectMime(buffer);
      const declared = file.type;
      const mime = detected ?? declared;
      const mapping = extensionFor(mime);

      if (!mapping) {
        throw new MediaError(`Tipe berkas tidak didukung: ${file.name}`, "INVALID_TYPE");
      }
      if (detected && declared && detected !== declared) {
        throw new MediaError(`Isi berkas tidak cocok dengan tipe yang diklaim: ${file.name}`, "MIME_MISMATCH");
      }

      const folder = mapping.kind === "image" ? "images" : "videos";
      const fileName = `${Date.now()}-${randomBytes(6).toString("hex")}.${mapping.ext}`;
      const relativePath = `${folder}/${fileName}`;
      const absolute = path.join(env.mediaDir, relativePath);

      await mkdir(path.dirname(absolute), { recursive: true });
      await writeFile(absolute, buffer);

      const record = mediaRepository.create({
        storagePath: relativePath,
        kind: mapping.kind,
        mime,
        originalName: file.name,
        byteSize: buffer.byteLength,
      });

      saved.push(withUrl(record));
    }

    return saved;
  },

  async remove(mediaId: number): Promise<boolean> {
    const record = mediaRepository.findById(mediaId);
    if (!record) return false;

    const env = getEnv();
    await unlink(path.join(env.mediaDir, record.storagePath)).catch(() => null);
    mediaRepository.delete(mediaId);
    return true;
  },
};
