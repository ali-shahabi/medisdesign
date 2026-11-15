import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { services } from '@/content/site';
import { Cta } from '@/components/Cta';
import { ServiceIcon } from '@/components/Icons';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { SecHead } from '@/components/Section';
import { Process } from '@/components/Sections';
import { serviceImage } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'خدمات ما | گروه مهندسی مدیس',
  description:
    'شش خدمت مدیس: طراحی و اجرای آکوستیک معماری، آکوستیک صنعتی، سینما و سالن‌های همایش، الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو.',
  path: '/services/',
});

export default function ServicesPage() {
  return (
    <>
      <PageLd
        path="/services/"
        name="خدمات ما | گروه مهندسی مدیس"
        description="شش خدمت مدیس: طراحی و اجرای آکوستیک معماری، آکوستیک صنعتی، سینما و سالن‌های همایش، الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'خدمات ما' }]}
      />

      <main id="main">
        <PageHero
          crumb={[['صفحه اصلی', '/'], ['خدمات ما']]}
          en="six practices"
          fa="خدمات"
          h1="خدمات ما"
          lede="از تحلیل فضا تا ساخت پنل؛ هر خدمت، ادامهٔ دیگری است. شش میدان، یک زبان مشترک."
        />

        <section className="sec tight" id="practices" aria-labelledby="practices-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="practices"
              fa="شش میدان"
              id="practices-h"
              title="شش میدان، یک پیوستار"
            />

            <div className="svc-grid">
              {services.map((service, i) => (
                <Link
                  key={service.slug}
                  className="card reveal"
                  href={`/services/${service.slug}/`}
                  style={{ '--d': `${(i % 3) * 0.06}s` } as CSSProperties}
                >
                  <div className="card-img">
                    <Picture
                      {...serviceImage(service.img)}
                      width={480}
                      height={270}
                      alt={service.alt}
                      sizes="(max-width: 700px) 92vw, (max-width: 1180px) 46vw, 410px"
                    />
                  </div>
                  <div className="card-body">
                    <span className="card-top">
                      <span className="card-n">{service.n}</span>
                      <ServiceIcon name={service.icon} />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.full}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Process />

        <Cta n="۰۳" h2="از کجا شروع کنیم؟" en="next step" fa="شروع" />
      </main>
    </>
  );
}
