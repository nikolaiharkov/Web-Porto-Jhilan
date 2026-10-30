export default function FloatingWhatsApp({ number }: { number: string }) {
  const clean = number.replace(/\D/g, "");
  if (!clean) return null;

  return (
    <a
      href={`https://wa.me/${clean}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
      className="wa-pulse fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg"
    >
      <i className="fa-brands fa-whatsapp" aria-hidden="true" />
    </a>
  );
}
