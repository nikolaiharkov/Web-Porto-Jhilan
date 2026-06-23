'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FloatingWA from '@/components/FloatingWA';
import Lightbox from '@/components/Lightbox';
import { ProjectItem, ProjectAsset } from '@/data/projects';

interface ProjectClientProps {
  project: ProjectItem;
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-dark text-white font-body selection:bg-neonCyan selection:text-dark pb-24">
      
      {/* Header Informasi Proyek */}
      <section className="pt-32 md:pt-40 max-w-6xl mx-auto px-6 md:px-12 mb-16">
        <Link href="/#projects" className="inline-flex items-center text-xs tracking-widest text-gray-500 hover:text-neonCyan transition mb-8 uppercase font-display">
          <i className="fa-solid fa-arrow-left mr-2 text-[10px]" /> Back to works
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/5 pb-12">
          <div className="md:col-span-8">
            <span className="font-display text-xs tracking-[0.4em] text-neonCyan uppercase mb-2 block">
              {project.category}
            </span>
            <h1 className="font-display text-2xl md:text-5xl font-bold tracking-wider text-white uppercase mb-4">
              {project.title}
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
          
          <div className="md:col-span-4 grid grid-cols-2 gap-4 font-display text-[10px] tracking-widest uppercase border-l border-white/5 pl-0 md:pl-8 pt-4 md:pt-0">
            <div>
              <span className="text-gray-600 block mb-1">Client</span>
              <span className="text-white font-medium">{project.client}</span>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">Year</span>
              <span className="text-white font-medium">{project.year}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Koleksi Album Komprehensif Berkas Internal Proyek */}
      <section className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {project.assets.map((asset: ProjectAsset, index: number) => (
            <div
              key={asset.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative bg-[#121212] border border-white/5 overflow-hidden aspect-[4/3] cursor-pointer hover:border-neonCyan hover:shadow-[0_10px_25px_rgba(0,243,255,0.1)] transition-all duration-300"
            >
              {asset.type === 'image' ? (
                <Image
                  src={asset.src}
                  alt={asset.title}
                  width={600}
                  height={450}
                  quality={70}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                /* Solusi Otomatis Thumbnail Pada Grid Internal: Memaksa Rendisi Detik Pertama */
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <video 
                    src={`${asset.src}#t=0.1`} 
                    muted 
                    preload="metadata" 
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                  />
                  <div className="absolute bg-dark/80 w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-neonCyan group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play text-xs ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="font-display text-[10px] tracking-wider text-white uppercase">{asset.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Render Modal Lightbox Dinamis Berdasarkan State */}
      {lightboxIndex !== null && (
        <Lightbox
          item={project.assets[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : project.assets.length - 1)}
          onNext={() => setLightboxIndex(lightboxIndex < project.assets.length - 1 ? lightboxIndex + 1 : 0)}
          hasMultiple={project.assets.length > 1}
        />
      )}

      <FloatingWA />
    </main>
  );
}