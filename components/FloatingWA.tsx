// components/FloatingWA.tsx
export default function FloatingWA() {
  return (
    <a 
      href="https://wa.me/6282112628113" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform wa-pulse active:scale-90" 
      aria-label="Chat with us on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-white text-3xl"></i>
    </a>
  );
}