// components/Hero.tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-dark text-white font-body selection:bg-neonCyan selection:text-dark">
      
      {/* Background Neon Aura Glimpses */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-neonCyan via-transparent to-transparent opacity-20 blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-30%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-neonMagenta via-transparent to-transparent opacity-20 blur-[120px] z-0 pointer-events-none" />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 w-full h-full z-[1]">
        <Image 
          src="/media/background/noise.png"
          alt="Texture layer"
          fill
          className="object-cover opacity-15 mix-blend-overlay"
          priority
        />
      </div>

      {/* Main Content Container - Centered */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col items-center justify-center pt-24 pb-16 text-center">
        
        {/* Main Title with Glitch Effect and Subtitle */}
        <div className="mb-12 relative">
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.5em] text-gray-500 uppercase">
            Visual Artist / Post-Production
          </span>
          <h1 className="glitch font-display text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-2 relative" data-text="Jhilan Al Farisi">
            Jhilan Al Farisi
          </h1>
          <p className="font-display text-sm md:text-lg tracking-[0.25em] text-neonCyan uppercase font-light">
            Photographer · Videographer · Editor
          </p>
        </div>

        {/* Call to Action Button */}
        <a 
          href="#projects" 
          className="px-10 py-4 border border-neonCyan text-neonCyan font-display text-xs tracking-[0.3em] uppercase font-semibold hover:bg-neonCyan hover:text-dark hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all duration-300 ease-out group mb-20 flex items-center gap-3"
        >
          Explore Works
          <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Bottom Social Links - Absolute but contained in centered div */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 text-xl text-gray-600">
          <a href="#" className="hover:text-neonCyan transition duration-300 transform hover:-translate-y-1"><i className="fa-brands fa-instagram" /></a>
          <a href="#" className="hover:text-neonCyan transition duration-300 transform hover:-translate-y-1"><i className="fa-brands fa-youtube" /></a>
          <a href="#" className="hover:text-neonCyan transition duration-300 transform hover:-translate-y-1"><i className="fa-brands fa-linkedin-in" /></a>
          <a href="#" className="hover:text-neonCyan transition duration-300 transform hover:-translate-y-1"><i className="fa-brands fa-behance" /></a>
        </div>
      </div>

      {/* FIXED POSITION SIDE ELEMENTS - Fix Tulisan Scroll agar proposional */}
      <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-16 text-[10px] tracking-[0.5em] text-gray-700 uppercase">
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-5">
          <i className="fa-solid fa-chevron-down animate-bounce text-xs" />
          <div className="w-[1px] h-20 bg-gradient-to-b from-gray-800 via-transparent to-gray-800" />
          <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="font-display font-semibold text-xs tracking-[0.3em] text-gray-800">SCROLL</span>
        </div>

        {/* Short Email Indicator with Mono Font */}
        <div className="flex flex-col items-center gap-6 lowercase">
          <i className="fa-solid fa-envelope text-xs" />
          <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="font-mono text-[9px] tracking-widest text-gray-800">farisi@harkovnet.biz.id</span>
        </div>

      </div>

    </section>
  );
}