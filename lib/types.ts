export type ContentStatus = "draft" | "published";

export type MediaKind = "image" | "video";

export interface MediaRecord {
  id: number;
  storagePath: string;
  kind: MediaKind;
  mime: string;
  originalName: string;
  byteSize: number;
  createdAt: string;
}

export interface MediaWithUrl extends MediaRecord {
  url: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Credit {
  label: string;
  value: string;
}

export interface SiteSettings {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutShort: string;
  aboutFull: string;
  profileMediaId: number | null;
  profileMedia: MediaWithUrl | null;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  socials: SocialLink[];
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  projectCount?: number;
  articleCount?: number;
}

export type ProjectMediaType = "image" | "video" | "youtube";

export interface ProjectMediaItem {
  id?: number;
  type: ProjectMediaType;
  mediaId: number | null;
  media: MediaWithUrl | null;
  youtubeUrl: string | null;
  youtubeId: string | null;
  title: string;
  alt: string;
  position: number;
}

export interface ProjectMediaInput {
  type: ProjectMediaType;
  mediaId: number | null;
  youtubeUrl: string | null;
  youtubeId: string | null;
  title: string;
  alt: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  category: Category | null;
  summary: string;
  description: string;
  credits: Credit[];
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  media: ProjectMediaItem[];
  featured: FeaturedMedia | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: number | null;
  category: Category | null;
  featuredMediaId: number | null;
  featured: FeaturedMedia | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedMedia {
  kind: "image" | "youtube";
  url: string;
  youtubeId: string | null;
  alt: string;
}

export interface UserAccount {
  id: number;
  username: string;
  isSeed: boolean;
  createdAt: string;
  updatedAt: string;
}
