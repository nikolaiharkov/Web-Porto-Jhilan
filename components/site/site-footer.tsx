import { settingsRepository } from "@/repositories/settings.repository";

export default function SiteFooter() {
  const settings = settingsRepository.get();

  return (
    <footer className="border-t border-white/10 bg-dark px-6 py-8 text-center font-body">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
        &copy; {new Date().getFullYear()} {settings.brandName}. All Rights Reserved
        <span className="mx-2 text-gray-700" aria-hidden="true">
          |
        </span>
        Developed by{" "}
        <a
          href="https://harkovnet.biz.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 underline decoration-white/20 underline-offset-4 transition hover:text-neonCyan"
        >
          Harkovnet Indonesia
        </a>
      </p>
    </footer>
  );
}
