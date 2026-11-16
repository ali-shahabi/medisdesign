import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { catalogScope, catalogues } from '@/content/site';
import { Cta } from '@/components/Cta';
import { Doc } from '@/components/Icons';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'کاتالوگ‌ها | گروه مهندسی مدیس',
  description: 'کاتالوگ‌های مدیس دیزاین: معرفی، آکوستیک معماری، اجرای الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو.',
  path: '/catalog/',
});

export default function CatalogPage() {
  return (
    <>
      <PageLd
        path="/catalog/"
        name="کاتالوگ‌ها | گروه مهندسی مدیس"
        description="کاتالوگ‌های مدیس دیزاین: معرفی، آکوستیک معماری، اجرای الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'کاتالوگ‌ها' }]}
      />

      <main id="main">
        <PageHero
          crumb={[['صفحه اصلی', '/'], ['کاتالوگ‌ها']]}
          en="catalogues"
          fa="کاتالوگ"
          h1="کاتالوگ‌ها"
          lede="چهار کاتالوگ، به‌همراه فهرست خدماتی که در کاتالوگ معرفی آمده است."
        />

        <section className="sec tight" id="catalogues" aria-labelledby="catalogues-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="four books"
              fa="کاتالوگ"
              id="catalogues-h"
              title="چهار کاتالوگ"
              note="برای دریافت فایل، یک تماس یا ایمیل کافی است."
            />

            <div className="cards-4">
              {catalogues.map((title, i) => (
                <article key={title} className="tile reveal" style={{ '--d': `${(i % 4) * 0.05}s` } as CSSProperties}>
                  <span className="tile-top">
                    <span className="n">{fa(i + 1)}</span>
                    <Doc />
                  </span>
                  <h3>{title}</h3>
                  <TextLink href="/contact/" className="mt-auto pt-[18px]">
                    درخواست کاتالوگ
                  </TextLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="scope" aria-labelledby="scope-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="scope of work"
              fa="محدوده"
              id="scope-h"
              title="محدودهٔ خدمات"
            />

            <div className="svc-grid">
              {catalogScope.map((group, i) => (
                <article key={group.title} className="tile reveal" style={{ '--d': `${(i % 3) * 0.05}s` } as CSSProperties}>
                  <h3 className="mt-0">
                    <span className="n me-3">{fa(i + 1)}</span>
                    {group.title}
                  </h3>
                  <ul role="list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Cta
          n="۰۳"
          h2="کاتالوگ را دریافت کنید"
          en="request"
          fa="درخواست"
          text="شمارهٔ تماس، ایمیل و آدرس دفتر مرکزی در پایین همین صفحه است."
        />
      </main>
    </>
  );
}
