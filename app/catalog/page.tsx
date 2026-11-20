import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { catalogScope, catalogues } from '@/content/site';
import { catalogue } from '@/content/products';
import { Asset } from '@/components/Asset';
import { Cta } from '@/components/Cta';
import { Doc } from '@/components/Icons';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { asset, fa } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'کاتالوگ‌ها | گروه مهندسی مدیس',
  description:
    'کاتالوگ مدیس با ۵۲ صفحه و شش فصل، همراه کاتالوگ‌های چاپی آکوستیک معماری، الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو.',
  path: '/catalog/',
});

export default function CatalogPage() {
  return (
    <>
      <PageLd
        path="/catalog/"
        name="کاتالوگ‌ها | گروه مهندسی مدیس"
        description="کاتالوگ مدیس با ۵۲ صفحه و شش فصل؛ دانلود فایل و درخواست نسخهٔ چاپی."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'کاتالوگ‌ها' }]}
      />

      <main id="main">
        <PageHero
          en="catalogues"
          fa="کاتالوگ"
          h1="کاتالوگ‌ها"
          lede={`کاتالوگ مدیس در ${fa(catalogue.pages)} صفحه و شش فصل؛ همین حالا دانلود کنید یا نسخهٔ چاپی را بخواهید.`}
          actions={
            <>
              <a className="btn" href={asset(catalogue.file)} download>
                دانلود کاتالوگ
              </a>
              <TextLink href="/contact/">درخواست نسخهٔ چاپی</TextLink>
            </>
          }
        />

        <section className="sec tight" id="download" aria-labelledby="download-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="download"
              fa="فایل"
              id="download-h"
              title="کاتالوگ مدیس"
              note={`PDF، ${fa(catalogue.pages)} صفحه، ${catalogue.sizeMb} مگابایت.`}
            />

            <div className="dl">
              <figure className="dl-cover">
                <Asset
                  src="/assets/img/spec/catalogue-cover.webp"
                  width={1310}
                  height={1853}
                  alt="جلد کاتالوگ مدیس"
                  priority
                />
              </figure>

              <div className="dl-body">
                <p className="dl-lead">
                  کاتالوگ با معرفی گروه آغاز می‌شود و در شش فصل، طراحی آکوستیکی معماری و صنعتی، الکتروآکوستیک، اجرای
                  آکوستیک، سالن سینما و همایش و در پایان محصولات آکوستیک ـ دکوراتیو را پوشش می‌دهد. شناسنامهٔ فنی هر مدل و
                  منحنی ضریب جذب آن، همان چیزی است که در صفحهٔ هر محصول در سایت هم آمده است.
                </p>

                <ol className="dl-chapters">
                  {catalogue.chapters.map((chapter) => (
                    <li key={chapter.n}>
                      <span className="idx">{chapter.n}</span>
                      <span className="ch-title">{chapter.title}</span>
                      <span className="ch-page">ص {fa(chapter.page)}</span>
                    </li>
                  ))}
                </ol>

                <div className="ph-actions">
                  <a className="btn" href={asset(catalogue.file)} download>
                    دانلود فایل کاتالوگ
                  </a>
                  <TextLink href="/products/">محصولات</TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="catalogues" aria-labelledby="catalogues-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="printed"
              fa="چاپی"
              id="catalogues-h"
              title="کاتالوگ‌های چاپی"
              note="نسخهٔ چاپی این کاتالوگ‌ها با یک تماس یا ایمیل ارسال می‌شود."
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

        <section className="sec tight" id="scope" aria-labelledby="scope-h">
          <div className="wrap">
            <SecHead n="۰۳" en="scope of work" fa="محدوده" id="scope-h" title="محدودهٔ خدمات" />

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
          n="۰۴"
          h2="کاتالوگ را دریافت کنید"
          en="request"
          fa="درخواست"
          text="شمارهٔ تماس، ایمیل و آدرس دفتر مرکزی در پایین همین صفحه است."
        />
      </main>
    </>
  );
}
