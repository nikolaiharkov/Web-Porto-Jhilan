// components/GalleryCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ProjectItem } from '@/data/projects';

interface GalleryCardProps {
  project: ProjectItem;
}

export default function GalleryCard({ project }: GalleryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fungsi untuk memutar cuplikan video saat kursor masuk
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Fungsi untuk menghentikan dan mengembalikan ke thumbnail awal saat kursor keluar
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Mengembalikan ke posisi detik ke-0.1 sebagai gambar statis kembali
      videoRef.current.currentTime = 0.1;
    }
  };

  return (
    <Link
      href={`/project/${project.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="project-card group relative bg-[#121212] border border-white/5 overflow-hidden aspect-[4/3] flex flex-col justify-end"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        {project.coverType === 'image' ? (
          <Image
            src={project.coverSrc}
            alt={project.title}
            width={600}
            height={450}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Solusi Otomatis Thumbnail: Menggunakan Parameter #t=0.1 */
          <video
            ref={videoRef}
            src={`${project.coverSrc}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
      </div>

      {/* Ornamen Penanda Konten */}
      <div className="absolute top-4 right-4 bg-black/60 border border-white/10 w-8 h-8 rounded-full flex items-center justify-center text-neonCyan backdrop-blur-md z-10 text-[10px]">
        <i className={project.coverType === 'video' ? "fa-solid fa-video" : "fa-solid fa-camera"} />
      </div>

      <div className="relative z-10 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <span className="font-display text-[9px] tracking-[0.3em] text-neonCyan uppercase mb-1 block">
          {project.category} &middot; {project.assets.length} items
        </span>
        <h3 className="font-display text-sm font-semibold tracking-wider text-white mb-2 group-hover:text-neonCyan transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-xs font-body font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 leading-relaxed">
          {project.description}
        </p>
      </div>
    </Link>
  );
}