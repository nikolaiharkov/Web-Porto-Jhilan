import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { getEnv } from "@/lib/env";

export interface SessionData {
  userId?: number;
  username?: string;
  loggedInAt?: string;
}

function options(): SessionOptions {
  const env = getEnv();

  return {
    cookieName: "jaf_cms",
    password: env.SESSION_SECRET,
    ttl: 60 * 60 * 24 * 7,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
      path: "/",
    },
  };
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), options());
}

export interface SessionUser {
  id: number;
  username: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session.userId) return null;
  return { id: session.userId, username: session.username ?? "" };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
