import type { Metadata } from 'next';
import './globals.css';
import { BackToTop } from '@/components/BackToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://medisdesign.com'),
  title: 'MedisDesign',
  description: 'به شرکت مدیس دیزاین خوش آمدید',
  icons: {
    icon: [
      { url: '/wp-content/uploads/2024/10/cropped-logo_-w-32x32.webp', sizes: '32x32' },
      { url: '/wp-content/uploads/2024/10/cropped-logo_-w-192x192.webp', sizes: '192x192' },
    ],
    apple: '/wp-content/uploads/2024/10/cropped-logo_-w-180x180.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="fa-IR">
      <body className="rtl l-body">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
