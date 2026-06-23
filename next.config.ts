/** @type {import('next').NextConfig} */
const nextConfig = {
  // Jika Anda menggunakan Static HTML Export (output murni folder 'out')
  
  images: {
    // MENYELESAIKAN BUG DUPLIKASI:
    // Memaksa Next.js menggunakan file asli di folder public secara langsung 
    // tanpa memproses ulang dan menduplikasinya ke dalam berkas cache build
    unoptimized: true, 
  },
};

export default nextConfig;