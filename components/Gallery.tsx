// components/Gallery.tsx
'use client';

import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import { PROJECTS_DATA, ProjectItem } from '@/data/projects';

type FilterCategory = 'all' | 'photography' | 'videography' | 'editing';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  return (
    <section id="projects" className="w-full bg-dark py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Kepala Sektor Galeri */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-display text-xs tracking-[0.4em] text-neonCyan uppercase mb-3 block">
              Portfolio
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-wider uppercase text-white">
              Selected Works
            </h2>
          </div>

          {/* Sistem Filter Tautan - Perbaikan Bug Scroll Slider */}
          <div className="flex items-center space-x-6 overflow-x-auto pb-2 md:pb-0 text-[10px] sm:text-xs font-display tracking-widest uppercase whitespace-nowrap max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {(['all', 'photography', 'videography', 'editing'] as FilterCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`pb-1 transition duration-300 text-gray-400 hover:text-white uppercase relative ${
                  activeFilter === category ? 'text-neonCyan filter-btn-active-line' : ''
                }`}
              >
                {category === 'all' ? 'All Projects' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Pemetaan Grid Proyek Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <GalleryCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}