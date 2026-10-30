import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/site/navbar";
import FloatingWhatsApp from "@/components/site/floating-whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { settingsRepository } from "@/repositories/settings.repository";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/structured-data";
import { getAppUrl } from "@/lib/env";
import { resolveSocialIcon } from "@/lib/social-icons";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = settingsRepository.get();
  const origin = getAppUrl();
  const image = settings.profileMedia?.url
    ? settings.profileMedia.url.startsWith("http")
      ? settings.profileMedia.url
      : `${origin}${settings.profileMedia.url}`
    : undefined;

  return {
    title: "Tentang",
    description: settings.aboutShort || `Profil ${settings.brandName}.`,
    alternates: { canonical: "/about" },
      openGraph: {
        title: `Tentang | ${settings.brandName}`,
      description: settings.aboutShort || `Profil ${settings.brandName}.`,
      url: `${origin}/about`,
      images: image ? [{ url: image, alt: settings.brandName }] : undefined,
    },
  };
}

export default async function AboutPage() {
  const settings = settingsRepository.get();
  const origin = getAppUrl();

  return (
    <main className="min-h-screen bg-dark font-body text-white">
      <JsonLd
        data={personJsonLd({
          brandName: settings.brandName,
          origin,
          description: settings.aboutShort || settings.heroSubtitle,
          image: settings.profileMedia?.url ?? null,
          socials: settings.socials,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Beranda", path: "/" },
            { name: "Tentang", path: "/about" },
          ],
          origin
        )}
      />

      <Navbar />

      <article className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-12">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          {settings.profileMedia ? (
            <Image
              src={settings.profileMedia.url}
              alt={`Foto profil ${settings.brandName}`}
              width={180}
              height={180}
              className="h-36 w-36 rounded-full border border-white/10 object-cover md:h-44 md:w-44"
            />
          ) : null}
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.5em] text-neonCyan">Profil</p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wider md:text-5xl">
              {settings.brandName}
            </h1>
            <p className="mt-3 text-sm text-gray-400">{settings.heroSubtitle}</p>
          </div>
        </header>

        {settings.aboutShort ? (
          <p className="mx-auto mb-10 max-w-2xl text-center font-body text-sm leading-relaxed text-gray-300 md:text-base">
            {settings.aboutShort}
          </p>
        ) : null}

        <div
          className="prose-invert mx-auto max-w-2xl space-y-4 font-body text-sm leading-relaxed text-gray-300 [&_a]:text-neonCyan [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-base [&_h3]:text-white [&_img]:my-6 [&_img]:w-full [&_img]:rounded [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: settings.aboutFull }}
        />

        {settings.socials.length > 0 ? (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {settings.socials.map((social) => (
              <a
                key={`${social.label}-${social.url}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center border border-white/10 text-base text-gray-300 transition hover:border-neonCyan hover:text-neonCyan"
              >
                <i className={resolveSocialIcon(social.icon)} aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}

        {settings.contactEmail || settings.contactWhatsapp ? (
          <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-gray-500">
            {settings.contactEmail ? (
              <p>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-neonCyan">
                  {settings.contactEmail}
                </a>
              </p>
            ) : null}
            {settings.contactWhatsapp ? <p className="mt-1">{settings.contactPhone || settings.contactWhatsapp}</p> : null}
          </div>
        ) : null}
      </article>

      <FloatingWhatsApp number={settings.contactWhatsapp} />
    </main>
  );
}
