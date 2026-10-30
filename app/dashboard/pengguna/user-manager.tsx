"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  changeOwnPasswordAction,
  createUserAction,
  deleteUserAction,
  resetUserPasswordAction,
} from "./actions";
import { idleState } from "@/lib/action-state";
import { buttonDanger, buttonGhost, buttonPrimary, inputClass } from "@/components/dashboard/ui";
import type { UserAccount } from "@/lib/types";

function Feedback({ state }: { state: { status: string; message?: string } }) {
  if (state.status === "idle" || !state.message) return null;
  const isError = state.status === "error";
  return (
    <p
      role="alert"
      className={`mt-2 rounded-md px-3 py-2 text-xs ${
        isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.message}
    </p>
  );
}

function randomPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export default function UserManager({
  users,
  currentUserId,
}: {
  users: UserAccount[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [createState, createAction, creating] = useActionState(createUserAction, idleState);
  const [passwordState, passwordAction, savingPassword] = useActionState(changeOwnPasswordAction, idleState);
  const [resetState, resetAction] = useActionState(resetUserPasswordAction, idleState);
  const [deleteState, deleteAction] = useActionState(deleteUserAction, idleState);
  const [generated, setGenerated] = useState("");

  const lastError = [resetState, deleteState].find((state) => state.status !== "idle");

  useEffect(() => {
    if (lastError?.status === "success") router.refresh();
  }, [lastError, router]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Tambah akun</h2>
        <form action={createAction} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="new-username" className="mb-1 block text-xs text-slate-600">
              Username
            </label>
            <input id="new-username" name="username" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1 block text-xs text-slate-600">
              Password
            </label>
            <div className="flex gap-2">
              <input
                id="new-password"
                name="password"
                value={generated}
                onChange={(event) => setGenerated(event.target.value)}
                minLength={8}
                required
                className={inputClass}
              />
              <button type="button" onClick={() => setGenerated(randomPassword())} className={buttonGhost}>
                Acak
              </button>
            </div>
          </div>
          <button type="submit" disabled={creating} className={buttonPrimary}>
            {creating ? "Menyimpan…" : "Tambah"}
          </button>
        </form>
        <Feedback state={createState} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Daftar akun</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {user.username}
                  {user.id === currentUserId ? <span className="ml-2 text-[11px] text-slate-500">(kamu)</span> : null}
                </p>
                <p className="text-[11px] text-slate-500">Dibuat {user.createdAt.slice(0, 10)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <form action={resetAction} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={user.id} />
                  <input
                    type="text"
                    name="password"
                    placeholder="Password baru"
                    minLength={8}
                    required
                    className="w-36 rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                  />
                  <button type="submit" disabled={savingPassword} className={buttonGhost}>
                    Reset
                  </button>
                </form>

                <form action={deleteAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    disabled={user.username === "admin" || users.length <= 1}
                    className={buttonDanger}
                    title={
                      user.username === "admin"
                        ? "Akun admin tidak dapat dihapus"
                        : users.length <= 1
                          ? "Akun terakhir tidak dapat dihapus"
                          : "Hapus akun"
                    }
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
        <Feedback state={lastError ?? { status: "idle" }} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Ganti password saya</h2>
        <form action={passwordAction} className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="current" className="mb-1 block text-xs text-slate-600">
              Password saat ini
            </label>
            <input id="current" name="currentPassword" type="password" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="next" className="mb-1 block text-xs text-slate-600">
              Password baru
            </label>
            <input id="next" name="newPassword" type="password" minLength={8} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1 block text-xs text-slate-600">
              Ulangi password baru
            </label>
            <input id="confirm" name="confirmPassword" type="password" minLength={8} required className={inputClass} />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={savingPassword} className={buttonPrimary}>
              {savingPassword ? "Menyimpan…" : "Simpan password"}
            </button>
          </div>
        </form>
        <Feedback state={passwordState} />
      </section>
    </div>
  );
}
