import { PageHeader } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/session";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";
import UserManager from "./user-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");

  const users = authService.list();

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Semua akun memiliki hak yang sama. Akun admin dan akun terakhir tidak dapat dihapus."
      />
      <UserManager users={users} currentUserId={current.id} />
    </>
  );
}
