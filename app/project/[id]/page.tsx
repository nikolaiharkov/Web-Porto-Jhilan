import Link from 'next/link';
import type { Metadata } from 'next';
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

// Fungsi Pembangkit Metadata Dinamis untuk Optimasi SEO Link Sharing Sub-Halaman
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = PROJECTS_DATA.find((p) => p.id === resolvedParams.id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  // Gunakan coverSrc jika bertipe gambar, atau fallback ke profil jika kover berupa video (.mp4)
  const imageUrl = project.coverType === 'image' ? project.coverSrc : '/faris.jpeg';

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Jhilan Al Farisi`,
      description: project.description,
      url: `https://alfrsproject.biz.id/project/${project.id}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Jhilan Al Farisi`,
      description: project.description,
      images: [imageUrl],
    },
  };
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