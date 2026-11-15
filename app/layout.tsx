import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Footer } from '@/components/Footer';
import { Mast } from '@/components/Mast';
import { MobileCta } from '@/components/MobileCta';
import { SiteBehavior } from '@/components/SiteBehavior';
import { SiteDefs } from '@/components/SiteDefs';
import { absolute, asset } from '@/lib/site';

const yekan = localFont({
  src: [
    { path: './fonts/yekan-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/yekan-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-yekan',
  display: 'swap',
  preload: true,
  fallback: ['Tahoma', 'system-ui', 'sans-serif'],
});

const sans = localFont({
  src: [
    { path: './fonts/sans-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/sans-400.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['Tahoma', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://medisdesign.com'),
  title: 'گروه مهندسی مدیس | طراحی آکوستیک، سالن همایش و سینما',
  description:
    'طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی؛ تحلیل، طراحی و اجرا در یک پیوستار.',
  applicationName: 'گروه مهندسی مدیس',
  authors: [{ name: 'گروه مهندسی مدیس' }],
  keywords: ['آکوستیک', 'طراحی آکوستیک', 'الکتروآکوستیک', 'سالن همایش', 'سینما', 'مدیس'],
  icons: {
    icon: [{ url: asset('/assets/brand/favicon-32.png'), sizes: '32x32', type: 'image/png' }],
    apple: [{ url: asset('/assets/brand/favicon-180.png'), sizes: '180x180' }],
    shortcut: asset('/assets/brand/favicon-32.png'),
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#F8F6F0',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const orgLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${absolute('/')}#organization`,
      name: 'گروه مهندسی مدیس',
      alternateName: 'MEDIS Design Group',
      url: absolute('/'),
      logo: {
        '@type': 'ImageObject',
        url: 'https://medisdesign.com/wp-content/uploads/2025/05/00695959.png',
        width: 500,
        height: 500,
      },
      image: absolute('/assets/brand/og-1200x630.jpg'),
      telephone: ['+982126413369', '+982126709572', '+989386038003'],
      email: 'medisdesign.team@gmail.com',
      sameAs: ['https://instagram.com/medisdesign.team'],
      address: [
        {
          '@type': 'PostalAddress',
          streetAddress: 'تهران، خیابان شریعتی، خیابان ظفر، پلاک 168، واحد 9',
          addressLocality: 'تهران',
          addressCountry: 'IR',
        },
        {
          '@type': 'PostalAddress',
          name: 'کارخانه',
          streetAddress: 'شهرک صنعتی صفادشت، بلوار فروردین، پلاک 310',
          addressLocality: 'صفادشت',
          addressCountry: 'IR',
        },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+989386038003',
        contactType: 'sales',
        areaServed: 'IR',
        availableLanguage: ['fa'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${absolute('/')}#website`,
      url: absolute('/'),
      name: 'گروه مهندسی مدیس',
      inLanguage: 'fa-IR',
      publisher: { '@id': `${absolute('/')}#organization` },
    },
  ],
};

/* run before the body paints so the reveal classes exist from the first frame */
const motionScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-IR" dir="rtl" className={`${yekan.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <a className="skip" href="#main">
          پرش به محتوای اصلی
        </a>
        <SiteDefs />
        <Mast />
        {children}
        <Footer />
        <MobileCta />
        <SiteBehavior />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </body>
    </html>
  );
}
