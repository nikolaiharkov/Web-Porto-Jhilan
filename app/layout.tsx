import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/site/site-footer";
import { getAppUrl } from "@/lib/env";
import { settingsRepository } from "@/repositories/settings.repository";

export async function generateMetadata(): Promise<Metadata> {
  const settings = settingsRepository.get();
  const origin = getAppUrl();
  const description =
    settings.aboutShort ||
    "Portofolio film producer: fotografi, videografi, dan penyuntingan video.";

  const image = settings.profileMedia
    ? settings.profileMedia.url.startsWith("http")
      ? settings.profileMedia.url
      : `${origin}${settings.profileMedia.url}`
    : undefined;

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${settings.brandName} | Photography & Visual Arts`,
      template: `%s | ${settings.brandName}`,
    },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: origin,
      siteName: settings.brandName,
      title: `${settings.brandName} | Photography & Visual Arts`,
      description,
      images: image ? [{ url: image, alt: settings.brandName }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.brandName} | Photography & Visual Arts`,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Orbitron:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#0a0a0a] font-body text-white antialiased selection:bg-[#00f3ff] selection:text-[#0a0a0a]">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
