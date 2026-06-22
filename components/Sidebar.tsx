// components/Sidebar.tsx
'use client';

import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Lapisan Latar Belakang Gelap Overlay - Tingkatan z-[90] */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Kontainer Panel Laci Menu - Tingkatan z-[100] */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-[#121212] border-l border-white/10 p-8 z-[100] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Tombol Penutup Laci */}
        <div className="flex justify-end mb-12">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-neonCyan transition focus:outline-none"
            aria-label="Close Menu"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        {/* Daftar Tautan Navigasi Internal */}
        <div className="flex flex-col space-y-6 font-display text-sm tracking-[0.3em] uppercase">
          <a 
            href="#" 
            onClick={onClose}
            className="text-gray-300 hover:text-neonCyan transition-colors py-2 border-b border-white/5 block"
          >
            Home
          </a>
          <a 
            href="#about" 
            onClick={onClose}
            className="text-gray-300 hover:text-neonCyan transition-colors py-2 border-b border-white/5 block"
          >
            About
          </a>
          <a 
            href="#projects" 
            onClick={onClose}
            className="text-gray-300 hover:text-neonCyan transition-colors py-2 border-b border-white/5 block"
          >
            Works
          </a>
          <a 
            href="#contact" 
            onClick={onClose}
            className="text-gray-300 hover:text-neonCyan transition-colors py-2 border-b border-white/5 block"
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}