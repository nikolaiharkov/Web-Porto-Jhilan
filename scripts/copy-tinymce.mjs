import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const source = path.join(root, "node_modules", "tinymce");
const target = path.join(root, "public", "tinymce");

if (!existsSync(source)) {
  console.warn("[postinstall] paket tinymce belum terpasang, salinan dilewati");
  process.exit(0);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const entry of ["tinymce.js", "themes", "icons", "models", "plugins", "skins"]) {
  cpSync(path.join(source, entry), path.join(target, entry), { recursive: true });
}

console.log("[postinstall] tinymce disalin ke public/tinymce");
