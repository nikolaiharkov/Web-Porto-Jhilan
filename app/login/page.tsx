import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">Masuk ke CMS</h1>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          <a href="/" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
            Kembali ke situs
          </a>
        </p>
      </div>
    </main>
  );
}
