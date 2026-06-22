// components/Lightbox.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ProjectAsset } from '@/data/projects';

interface LightboxProps {
  item: ProjectAsset;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasMultiple: boolean;
}

export default function Lightbox({ item, onClose, onPrev, onNext, hasMultiple }: LightboxProps) {
  
  // Sinkronisasi kontrol aksesibilitas via Keyboard browser
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple) {
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Mengunci scroll bodi utama saat modal aktif

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Mengembalikan fungsi gulir normal
    };
  }, [onClose, onPrev, onNext, hasMultiple]);

  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col justify-between p-4 md:p-8 backdrop-blur-md animate-fade-in">
      
      {/* Panel Navigasi Atas Lightbox */}
      <div className="w-full flex justify-between items-center z-10 py-2">
        <div className="text-left max-w-xl pr-6">
          <span className="font-display text-[9px] tracking-[0.3em] text-neonCyan uppercase block mb-0.5">
            Asset Type &middot; {item.type}
          </span>
          <h4 className="font-display text-sm md:text-base font-medium tracking-wide text-white uppercase">
            {item.title}
          </h4>
        </div>
        
        {/* Tombol Tutup Modal */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-neonMagenta transition-colors duration-300 text-xl w-10 h-10 flex items-center justify-center border border-white/5 hover:border-neonMagenta/20 bg-white/5 backdrop-blur-sm"
          aria-label="Close Lightbox"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      {/* Bagian Area Konten Utama Media */}
      <div className="flex-1 w-full flex items-center justify-between relative max-h-[80vh]">
        
        {/* Tombol Geser Kiri */}
        {hasMultiple && (
          <button
            onClick={onPrev}
            className="absolute left-0 md:-left-4 z-20 text-white hover:text-neonCyan bg-black/40 hover:bg-black/80 w-12 h-12 flex items-center justify-center border border-white/5 text-base transition-all duration-300 active:scale-90"
            aria-label="Previous Media"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
        )}

        {/* Pemutar Media Sentral */}
        <div className="w-full h-full flex items-center justify-center p-2 relative">
          {item.type === 'image' ? (
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
              <Image
                src={item.src}
                alt={item.title}
                width={1920}
                height={1080}
                className="max-w-full max-h-[80vh] object-contain animate-scale-up"
                priority={true}
              />
            </div>
          ) : (
            <video
              src={item.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-w-full max-h-[80vh] object-contain rounded border border-white/5 bg-black shadow-2xl animate-scale-up"
            />
          )}
        </div>

        {/* Tombol Geser Kanan */}
        {hasMultiple && (
          <button
            onClick={onNext}
            className="absolute right-0 md:-right-4 z-20 text-white hover:text-neonCyan bg-black/40 hover:bg-black/80 w-12 h-12 flex items-center justify-center border border-white/5 text-base transition-all duration-300 active:scale-90"
            aria-label="Next Media"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        )}
      </div>

      {/* Panel Informasi Bawah Album Lightbox */}
      <div className="w-full max-w-2xl mx-auto text-center py-4 z-10">
        <p className="text-gray-500 font-body text-xs tracking-wide italic">
          Viewing: {item.title}
        </p>
      </div>

    </div>
  );
}