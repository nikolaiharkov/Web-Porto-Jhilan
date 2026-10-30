"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { MediaError, mediaService } from "@/services/media.service";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";

export async function deleteMediaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const mediaId = Number(formData.get("mediaId"));
    if (!Number.isFinite(mediaId)) return errorState("Media tidak valid");

    const usage = mediaService.usage(mediaId);
    const blocked = usage.some((item) => item.kind === "settings");
    if (blocked) {
      return errorState("Media ini dipakai sebagai foto profil. Ganti foto profil terlebih dahulu.");
    }

    await mediaService.remove(mediaId);
    revalidatePath("/dashboard/media");
    return successState("Media dihapus");
  } catch (error) {
    if (error instanceof MediaError) return errorState(error.message);
    return errorState(toMessage(error, "Gagal menghapus media"));
  }
}
