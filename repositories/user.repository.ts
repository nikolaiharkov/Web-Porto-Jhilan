import { getDb, nowIso } from "@/lib/db";
import type { UserAccount } from "@/lib/types";

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  is_seed: number;
  created_at: string;
  updated_at: string;
}

export interface UserWithHash extends UserAccount {
  passwordHash: string;
}

function toAccount(row: UserRow): UserAccount {
  return {
    id: row.id,
    username: row.username,
    isSeed: row.is_seed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const userRepository = {
  list(): UserAccount[] {
    const rows = getDb()
      .prepare("SELECT * FROM users ORDER BY is_seed DESC, username ASC")
      .all() as UserRow[];
    return rows.map(toAccount);
  },

  count(): number {
    const row = getDb().prepare("SELECT COUNT(*) AS total FROM users").get() as { total: number };
    return row.total;
  },

  findById(id: number): UserWithHash | null {
    const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
    if (!row) return null;
    return { ...toAccount(row), passwordHash: row.password_hash };
  },

  findByUsername(username: string): UserWithHash | null {
    const row = getDb().prepare("SELECT * FROM users WHERE username = ?").get(username) as
      | UserRow
      | undefined;
    if (!row) return null;
    return { ...toAccount(row), passwordHash: row.password_hash };
  },

  create(username: string, passwordHash: string, isSeed = false): UserAccount {
    const now = nowIso();
    const result = getDb()
      .prepare(
        "INSERT INTO users (username, password_hash, is_seed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      )
      .run(username, passwordHash, isSeed ? 1 : 0, now, now);
    const row = getDb()
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(Number(result.lastInsertRowid)) as UserRow;
    return toAccount(row);
  },

  updatePassword(id: number, passwordHash: string): void {
    getDb()
      .prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")
      .run(passwordHash, nowIso(), id);
  },

  delete(id: number): void {
    getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
  },
};
