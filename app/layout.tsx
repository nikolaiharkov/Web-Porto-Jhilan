import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://alfrsproject.biz.id"),
  title: {
    default: "Jhilan Al Farisi | Photography & Visual Arts",
    template: "%s | Jhilan Al Farisi",
  },
  description: "Portofolio profesional fotografer, videografer, dan editor video - Jhilan Al Farisi.",
  openGraph: {
    title: "Jhilan Al Farisi | Photography & Visual Arts",
    description: "Portofolio profesional fotografer, videografer, dan editor video - Jhilan Al Farisi.",
    url: "https://alfrsproject.biz.id",
    siteName: "Jhilan Al Farisi Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/faris.jpeg",
        width: 1200,
        height: 630,
        alt: "Jhilan Al Farisi | Photography & Visual Arts Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhilan Al Farisi | Photography & Visual Arts",
    description: "Portofolio profesional fotografer, videografer, dan editor video - Jhilan Al Farisi.",
    images: ["/faris.jpeg"],
  },
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
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased selection:bg-[#00f3ff] selection:text-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}