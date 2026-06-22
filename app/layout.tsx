// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jhilan Al Farisi | Photography & Visual Arts",
  description: "Portofolio profesional fotografer, videografer, dan editor video - Jhilan Al Farisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Fonts Preconnect & Loader */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Orbitron:wght@700&display=swap" 
          rel="stylesheet" 
        />
        {/* FontAwesome CDN untuk Ikon Sosial & Antarmuka */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />

        {/* Interseptor Sinkronus untuk Menyaring Peringatan Produksi Tailwind CDN */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const originalWarn = console.warn;
            console.warn = function(...args) {
              if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) {
                return;
              }
              originalWarn.apply(console, args);
            };
          })();
        `}} />

        {/* Memuat Pustaka Utama Tailwind CSS via CDN murni secara langsung */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Injeksi Konfigurasi Kustomisasi Tema Warna dan Font Tailwind */}
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  dark: '#0a0a0a',
                  charcoal: '#121212',
                  neonCyan: '#00f3ff',
                  neonMagenta: '#ff00ff',
                },
                fontFamily: {
                  display: ['Orbitron', 'sans-serif'],
                  body: ['Inter', 'sans-serif'],
                }
              }
            }
          }
        `}} />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased selection:bg-[#00f3ff] selection:text-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}