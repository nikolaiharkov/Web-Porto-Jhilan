import Link from "next/link";
import Navbar from "@/components/site/navbar";
import Hero from "@/components/site/hero";
import AboutSection from "@/components/site/about-section";
import { ProjectGrid } from "@/components/site/project-grid";
import { ArticleGrid } from "@/components/site/article-grid";
import ContactSection from "@/components/site/contact-section";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { projectRepository } from "@/repositories/project.repository";
import { articleRepository } from "@/repositories/article.repository";
import { settingsRepository } from "@/repositories/settings.repository";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = settingsRepository.get();
  const projects = projectRepository.list("published").slice(0, 6);
  const articles = articleRepository.list("published").slice(0, 3);
  const origin = getAppUrl();

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: personJsonLd({
            brandName: settings.brandName,
            origin,
            description: settings.aboutShort || settings.heroSubtitle,
            image: settings.profileMedia?.url ?? null,
            socials: settings.socials,
          }),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }], origin)} />

      <Navbar />
      <Hero settings={settings} />
      <AboutSection settings={settings} />

      <section id="projects" className="w-full bg-dark px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonCyan">
                Portofolio
              </span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
                Karya Pilihan
              </h2>
            </div>
            <Link
              href="/portofolio"
              className="font-display text-[11px] uppercase tracking-[0.3em] text-gray-400 underline decoration-white/20 underline-offset-8 transition hover:text-neonCyan"
            >
              Lihat semua
            </Link>
          </div>

          <ProjectGrid
            projects={projects}
            emptyMessage="Belum ada proyek yang diterbitkan."
          />
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="w-full border-t border-white/5 bg-charcoal px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonMagenta">
                  Jurnal
                </span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
                  Tulisan Terbaru
                </h2>
              </div>
              <Link
                href="/artikel"
                className="font-display text-[11px] uppercase tracking-[0.3em] text-gray-400 underline decoration-white/20 underline-offset-8 transition hover:text-neonCyan"
              >
                Semua artikel
              </Link>
            </div>
            <ArticleGrid articles={articles} />
          </div>
        </section>
      ) : null}

      <section className="w-full border-t border-white/5 bg-charcoal px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonCyan">
            Kerja Sama
          </span>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-wider text-white md:text-4xl">
            Butuh foto atau video yang benar-benar selesai?
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-sm leading-relaxed text-gray-400 md:text-base">
            Saya mengerjakan fotografi, videografi, dan penyuntingan dari praproduksi sampai hasil akhir.
            Ceritakan kebutuhan Anda, lalu kita tentukan alurnya bersama.
          </p>
          <a
            href="#contact"
            className="group mt-9 inline-flex items-center gap-3 border border-neonCyan px-10 py-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-neonCyan transition-all duration-300 hover:bg-neonCyan hover:text-dark"
          >
            Diskusikan Proyek
            <i
              className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </section>

      <ContactSection settings={settings} />
      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
