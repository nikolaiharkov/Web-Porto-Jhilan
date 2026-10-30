"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthError, authService } from "@/services/auth.service";
import { errorState, type ActionState } from "@/lib/action-state";

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return errorState("Username dan password wajib diisi");
  }

  let mustChange = false;

  try {
    const user = await authService.login(username, password);
    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.loggedInAt = new Date().toISOString();
    await session.save();
    mustChange = authService.isDefaultPassword(username, password);
  } catch (error) {
    if (error instanceof AuthError) return errorState(error.message);
    return errorState("Gagal masuk, coba lagi");
  }

  redirect(mustChange ? "/dashboard?notice=default-password" : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
