import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shell";
import { authService } from "@/services/auth.service";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell username={user.username} userCount={authService.list().length}>
      {children}
    </DashboardShell>
  );
}
