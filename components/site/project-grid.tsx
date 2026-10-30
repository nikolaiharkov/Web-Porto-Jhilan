import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portofolio/${project.slug}`}
      className="project-card group block overflow-hidden border border-white/10 bg-charcoal"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        {project.featured ? (
          <Image
            src={project.featured.url}
            alt={project.featured.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
            Media belum tersedia
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-neonCyan">
          {project.category?.name ?? "Tanpa kategori"}
        </span>
        <h3 className="mt-2 font-display text-base font-semibold uppercase tracking-wide text-white">
          {project.title}
        </h3>
        {project.summary ? (
          <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-gray-500">{project.summary}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function ProjectGrid({
  projects,
  emptyMessage,
}: {
  projects: Project[];
  emptyMessage: string;
}) {
  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="font-body text-sm text-gray-500">{emptyMessage}</p>
        <Link
          href="/#contact"
          className="mt-4 inline-block font-display text-[11px] uppercase tracking-[0.3em] text-neonCyan underline underline-offset-8"
        >
          Hubungi untuk kolaborasi
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
