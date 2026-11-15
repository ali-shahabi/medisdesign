import type { MetadataRoute } from 'next';
import { allContentPaths } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = 'https://medisdesign.com';
  const now = new Date('2025-10-01T13:13:00+00:00');

  return allContentPaths.map((path) => ({
    url: path === '/' ? `${origin}/` : `${origin}${path}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
