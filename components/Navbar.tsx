// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/10 px-6 py-4 md:px-12 flex justify-between items-center backdrop-blur-lg">
        {/* Identitas Brand */}
        <a href="/" className="font-display text-xl font-bold tracking-widest text-white hover:text-neonCyan transition">
          JAF<span className="text-neonCyan">.</span>
        </a>

        {/* Menu Navigasi Layar Lebar dengan Jalur Absolut Anchor */}
        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-[0.2em]">
          <a href="/#about" className="text-gray-400 hover:text-neonCyan transition duration-300">About</a>
          <a href="/#projects" className="text-gray-400 hover:text-neonCyan transition duration-300">Works</a>
          <a href="/#contact" className="text-gray-400 hover:text-neonCyan transition duration-300">Contact</a>
        </div>

        {/* Tombol Pemicu Menu Seluler */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="block md:hidden text-white hover:text-neonCyan transition focus:outline-none"
          aria-label="Open Menu"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}