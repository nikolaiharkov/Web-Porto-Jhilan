// components/About.tsx
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="w-full bg-charcoal py-24 md:py-32 border-y border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Kolom Kiri: Tampilan Foto Profil Menggunakan next/image */}
          <div className="md:col-span-5 flex justify-center relative group">
            <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-neonCyan to-neonMagenta opacity-20 blur-2xl group-hover:opacity-40 transition duration-500 pointer-events-none" />
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-[3px] bg-gradient-to-tr from-neonCyan via-transparent to-neonMagenta shadow-[0_0_30px_rgba(0,243,255,0.1)] group-hover:shadow-[0_0_40px_rgba(0,243,255,0.25)] transition duration-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-dark relative">
                <Image
                  // Perubahan disini: src diganti ke faris.jpeg di folder public
                  src="/faris.jpeg" 
                  alt="Jhilan Al Farisi Profile"
                  // Ratio 1:1 tetap dipertahankan
                  width={400}
                  height={400}
                  // object-cover memastikan gambar mengisi container 1:1 dengan cocok tanpa distorsi
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Narasi Visioner & Sosmed */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <span className="font-display text-xs tracking-[0.4em] text-neonCyan uppercase mb-3 block">
              The Visionary
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-wider uppercase mb-6 text-white">
              Behind the Lens
            </h2>
            <div className="space-y-4 text-gray-400 font-body text-sm md:text-base leading-relaxed font-light">
              <p>
                Saya adalah seorang perupa visual berbasis di Jakarta, Indonesia, yang mendedikasikan 
                diri sepenuhnya pada dunia fotografi, produksi video, serta penyuntingan digital selama 
                lebih dari 5 tahun terakhir.
              </p>
              <p>
                Bagi saya, setiap bidikan lensa bukan sekadar dokumentasi teknis semata, melainkan medium 
                bercerita yang menangkap emosi mentah, dinamika atmosfer, dan esensi sinematik yang abadi. 
                Dari panggung pertunjukan orkestra megah, dokumentasi olahraga intensitas tinggi, hingga 
                garapan film naratif komersial.
              </p>
            </div>

            <div className="w-16 h-[1px] bg-white/10 my-8" />

            {/* Hubungan Jejaring Sosial */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <span className="font-display text-[10px] tracking-[0.3em] uppercase text-gray-500">
                Connect channels:
              </span>
              <div className="flex space-x-6 text-lg text-gray-400">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-neonCyan transition duration-300">
                  <i className="fa-brands fa-instagram" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-neonCyan transition duration-300">
                  <i className="fa-brands fa-youtube" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neonCyan transition duration-300">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-neonCyan transition duration-300">
                  <i className="fa-brands fa-behance" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}