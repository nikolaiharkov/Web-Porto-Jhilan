export interface SocialIconOption {
  value: string;
  label: string;
}

export const SOCIAL_ICONS: SocialIconOption[] = [
  { value: "fa-brands fa-instagram", label: "Instagram" },
  { value: "fa-brands fa-youtube", label: "YouTube" },
  { value: "fa-brands fa-linkedin-in", label: "LinkedIn" },
  { value: "fa-brands fa-behance", label: "Behance" },
  { value: "fa-brands fa-x-twitter", label: "X / Twitter" },
  { value: "fa-brands fa-tiktok", label: "TikTok" },
  { value: "fa-brands fa-facebook-f", label: "Facebook" },
  { value: "fa-brands fa-whatsapp", label: "WhatsApp" },
  { value: "fa-brands fa-threads", label: "Threads" },
  { value: "fa-brands fa-vimeo-v", label: "Vimeo" },
  { value: "fa-brands fa-github", label: "GitHub" },
  { value: "fa-brands fa-spotify", label: "Spotify" },
  { value: "fa-solid fa-envelope", label: "Email" },
  { value: "fa-solid fa-globe", label: "Website" },
];

const FALLBACK_ICON = "fa-solid fa-globe";

export function resolveSocialIcon(icon: string | undefined | null): string {
  const value = (icon ?? "").trim();
  if (!value) return FALLBACK_ICON;
  if (!/^fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*$/i.test(value)) return FALLBACK_ICON;
  return value;
}
