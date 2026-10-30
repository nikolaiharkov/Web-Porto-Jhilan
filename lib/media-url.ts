const MEDIA_MARKER = "media/";

const LEADING_RELATIVE = /^(?:\.{1,2}\/)+media\//;

export function normalizeMediaUrls(html: string): string {
  if (!html.includes("<img")) return html;

  return html.replace(/(<img\b[^>]*?\bsrc=)(["'])([^"']*)\2/gi, (match, prefix, quote, rawSrc) => {
    const normalized = normalizeSrc(rawSrc);
    return normalized ? `${prefix}${quote}${normalized}${quote}` : match;
  });
}

function normalizeSrc(rawSrc: string): string | null {
  const src = rawSrc.trim();
  if (!src) return null;

  if (src.startsWith("data:") || src.startsWith("blob:")) return null;

  if (src.startsWith("/media/")) return src;

  if (LEADING_RELATIVE.test(src)) {
    return `/${src.replace(LEADING_RELATIVE, MEDIA_MARKER)}`;
  }

  if (src.startsWith("media/")) return `/${src}`;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      if (url.pathname.startsWith("/media/")) return `${url.pathname}${url.search}`;
    } catch {
      return null;
    }
  }

  return null;
}
