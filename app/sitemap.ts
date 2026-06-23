import { MetadataRoute } from 'next';
import { PROJECTS_DATA } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alfrsproject.biz.id';

  // 1. Daftarkan halaman beranda (root) utama portfolio
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // 2. Ekstrak dan daftarkan seluruh rute dinamis project secara iteratif dari repositori data
  const projectRoutes: MetadataRoute.Sitemap = PROJECTS_DATA.map((project) => ({
    url: `${baseUrl}/project/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 3. Gabungkan seluruh daftar rute menjadi satu kesatuan sitemap utuh
  return [...staticRoutes, ...projectRoutes];
}