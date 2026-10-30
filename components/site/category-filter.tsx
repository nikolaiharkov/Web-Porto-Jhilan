"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category } from "@/lib/types";

export function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: number | "all";
  onChange: (value: number | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-5 overflow-x-auto pb-2 font-display text-[10px] uppercase tracking-widest sm:text-xs">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`relative pb-1 transition ${
          active === "all" ? "text-neonCyan filter-btn-active-line" : "text-gray-400 hover:text-white"
        }`}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`relative pb-1 transition ${
            active === category.id ? "text-neonCyan filter-btn-active-line" : "text-gray-400 hover:text-white"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export function CategoryFilterShell({
  categories,
  items,
}: {
  categories: Category[];
  items: Array<{ categoryId: number; node: React.ReactNode }>;
}) {
  const [active, setActive] = useState<number | "all">("all");

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((item) => item.categoryId === active)),
    [active, items]
  );

  return (
    <>
      <CategoryFilter categories={categories} active={active} onChange={setActive} />
      <div className="mt-10">
        {visible.length === 0 ? (
          <div className="border border-dashed border-white/10 px-6 py-16 text-center">
            <p className="font-body text-sm text-gray-500">Belum ada karya pada kategori ini.</p>
            <Link
              href="/#contact"
              className="mt-4 inline-block font-display text-[11px] uppercase tracking-[0.3em] text-neonCyan underline underline-offset-8"
            >
              Hubungi untuk kolaborasi
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {visible.map((item) => item.node)}
          </div>
        )}
      </div>
    </>
  );
}
