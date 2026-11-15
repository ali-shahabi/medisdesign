import type { MetadataRoute } from 'next';
import { BASE } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'گروه مهندسی مدیس',
    short_name: 'مدیس',
    description: 'طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی.',
    lang: 'fa-IR',
    dir: 'rtl',
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#F8F6F0',
    theme_color: '#F8F6F0',
    icons: [
      { src: `${BASE}/assets/brand/favicon-180.png`, sizes: '180x180', type: 'image/png' },
      { src: `${BASE}/assets/brand/favicon-32.png`, sizes: '32x32', type: 'image/png' },
    ],
  };
}
