import type { Metadata } from 'next';
import { absolute } from './site';

const OG = '/assets/brand/og-1200x630.jpg';

type Props = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageW?: number;
  imageH?: number;
  imageAlt?: string;
};

export function pageMeta({
  title,
  description,
  path,
  image = OG,
  imageW = 1200,
  imageH = 630,
  imageAlt = 'سالن کنسرت با پوشش آکوستیک چوبی',
}: Props): Metadata {
  const url = absolute(path);
  const img = absolute(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'گروه مهندسی مدیس',
      locale: 'fa_IR',
      images: [{ url: img, width: imageW, height: imageH, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img],
    },
  };
}
