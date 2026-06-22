// app/project/[id]/page.tsx
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProjectClient from '@/components/ProjectClient';
import { PROJECTS_DATA } from '@/data/projects';

// Fungsi Pembangkit Rute Statis (Dieksekusi Murni di Sisi Server)
export function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({
    id: project.id,
  }));
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Mengurai (unwrap) data parameter rute secara asinkron sesuai standar Next.js
  const resolvedParams = await params;
  const project = PROJECTS_DATA.find((p) => p.id === resolvedParams.id);

  if (!project) {
    return (
      <main className="min-h-screen bg-dark text-white font-body flex items-center justify-center flex-col gap-4">
        <h1 className="font-display text-sm tracking-widest text-neonMagenta">PROJECT NOT FOUND</h1>
        <Link href="/" className="text-xs uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-neonCyan text-gray-400 hover:text-white transition">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      {/* Melempar data proyek yang valid dari Server ke Client Component */}
      <ProjectClient project={project} />
    </>
  );
}