import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDateId } from "@/lib/utils";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="font-body text-sm text-gray-500">Belum ada artikel yang diterbitkan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/artikel/${article.slug}`}
          className="project-card group flex flex-col overflow-hidden border border-white/10 bg-charcoal"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            {article.featured ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.featured.url}
                alt={article.featured.alt || article.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
                Tanpa gambar
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-wrap items-center gap-2 font-display text-[10px] uppercase tracking-[0.25em] text-gray-500">
              <span className="text-neonCyan">{article.category?.name ?? "Catatan"}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt ?? undefined}>{formatDateId(article.publishedAt)}</time>
            </div>
            <h3 className="mt-2 font-display text-base font-semibold leading-snug text-white">
              {article.title}
            </h3>
            {article.excerpt ? (
              <p className="mt-2 line-clamp-3 font-body text-xs leading-relaxed text-gray-500">
                {article.excerpt}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
