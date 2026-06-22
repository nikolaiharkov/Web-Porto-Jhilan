// app/page.tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import FloatingWA from '@/components/FloatingWA';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark text-white font-body selection:bg-neonCyan selection:text-dark">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Contact />
      <FloatingWA />

      {/* Perbaikan Teks Hak Cipta & Tautan Aktif Harkovnet Indonesia */}
      <footer className="py-12 border-t border-white/5 text-center px-6">
        <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-2">
          &copy; {new Date().getFullYear()} Jhilan Al Farisi. All Rights Reserved.
        </p>
        <p className="text-[9px] tracking-[0.2em] text-gray-600 uppercase">
          Developed by{' '}
          <a 
            href="https://harkovnet.biz.id/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-neonCyan transition duration-300 font-medium"
          >
            Harkovnet Indonesia
          </a>
        </p>
      </footer>
    </main>
  );
}