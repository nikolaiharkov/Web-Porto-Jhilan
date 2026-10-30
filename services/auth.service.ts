import "server-only";
import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import type { UserAccount } from "@/lib/types";

export class AuthError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

const MIN_PASSWORD = 8;

export const authService = {
  async login(username: string, password: string): Promise<UserAccount> {
    const user = userRepository.findByUsername(username.trim());
    if (!user) throw new AuthError("Username atau password salah", "INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AuthError("Username atau password salah", "INVALID_CREDENTIALS");

    const { passwordHash: _ignored, ...account } = user;
    return account;
  },

  isDefaultPassword(username: string, password: string): boolean {
    return username.trim().toLowerCase() === "admin" && password === "admin";
  },

  async changeOwnPassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = userRepository.findById(userId);
    if (!user) throw new AuthError("Akun tidak ditemukan", "NOT_FOUND");

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new AuthError("Password saat ini salah", "INVALID_CURRENT");

    if (newPassword.length < MIN_PASSWORD) {
      throw new AuthError(`Password baru minimal ${MIN_PASSWORD} karakter`, "WEAK_PASSWORD");
    }

    userRepository.updatePassword(userId, await bcrypt.hash(newPassword, 10));
  },

  async createUser(username: string, password: string): Promise<UserAccount> {
    const clean = username.trim();
    if (clean.length < 3) throw new AuthError("Username minimal 3 karakter", "INVALID_USERNAME");
    if (!/^[a-zA-Z0-9._-]+$/.test(clean)) {
      throw new AuthError("Username hanya boleh huruf, angka, titik, garis bawah, dan strip", "INVALID_USERNAME");
    }
    if (userRepository.findByUsername(clean)) {
      throw new AuthError("Username sudah dipakai", "DUPLICATE_USERNAME");
    }
    if (password.length < MIN_PASSWORD) {
      throw new AuthError(`Password minimal ${MIN_PASSWORD} karakter`, "WEAK_PASSWORD");
    }
    return userRepository.create(clean, await bcrypt.hash(password, 10));
  },

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    const user = userRepository.findById(userId);
    if (!user) throw new AuthError("Akun tidak ditemukan", "NOT_FOUND");
    if (newPassword.length < MIN_PASSWORD) {
      throw new AuthError(`Password minimal ${MIN_PASSWORD} karakter`, "WEAK_PASSWORD");
    }
    userRepository.updatePassword(userId, await bcrypt.hash(newPassword, 10));
  },

  deleteUser(userId: number): void {
    const user = userRepository.findById(userId);
    if (!user) throw new AuthError("Akun tidak ditemukan", "NOT_FOUND");
    if (user.username === "admin") throw new AuthError("Akun admin tidak dapat dihapus", "PROTECTED_ACCOUNT");
    if (userRepository.count() <= 1) throw new AuthError("Akun terakhir tidak dapat dihapus", "LAST_ACCOUNT");
    userRepository.delete(userId);
  },

  list(): UserAccount[] {
    return userRepository.list();
  },

  generatePassword(): string {
    const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let output = "";
    for (let index = 0; index < MIN_PASSWORD; index += 1) {
      output += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return output;
  },
};
