"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { AuthError, authService } from "@/services/auth.service";
import { errorState, successState, toMessage, type ActionState } from "@/lib/action-state";

const createSchema = z.object({
  username: z.string().trim().min(3).max(32),
  password: z.string().min(8).max(72),
});

const passwordSchema = z.object({
  password: z.string().min(8).max(72),
});

export async function changeOwnPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const current = String(formData.get("currentPassword") ?? "");
    const next = String(formData.get("newPassword") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (next !== confirm) return errorState("Konfirmasi password tidak sama");

    await authService.changeOwnPassword(user.id, current, next);
    return successState("Password berhasil diubah");
  } catch (error) {
    if (error instanceof AuthError) return errorState(error.message);
    return errorState(toMessage(error, "Gagal mengubah password"));
  }
}

export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const parsed = createSchema.safeParse({
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (!parsed.success) {
      return errorState("Username minimal 3 karakter dan password minimal 8 karakter");
    }
    await authService.createUser(parsed.data.username, parsed.data.password);
    revalidatePath("/dashboard/pengguna");
    return successState(`Akun ${parsed.data.username} dibuat`);
  } catch (error) {
    if (error instanceof AuthError) return errorState(error.message);
    return errorState(toMessage(error, "Gagal membuat akun"));
  }
}

export async function resetUserPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireUser();
    const userId = Number(formData.get("userId"));
    const parsed = passwordSchema.safeParse({ password: String(formData.get("password") ?? "") });
    if (!parsed.success) return errorState("Password minimal 8 karakter");
    await authService.resetPassword(userId, parsed.data.password);
    revalidatePath("/dashboard/pengguna");
    return successState("Password akun diperbarui");
  } catch (error) {
    if (error instanceof AuthError) return errorState(error.message);
    return errorState(toMessage(error, "Gagal memperbarui password"));
  }
}

export async function deleteUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireUser();
    const userId = Number(formData.get("userId"));
    authService.deleteUser(userId);
    revalidatePath("/dashboard/pengguna");
    return successState("Akun dihapus");
  } catch (error) {
    if (error instanceof AuthError) return errorState(error.message);
    return errorState(toMessage(error, "Gagal menghapus akun"));
  }
}
