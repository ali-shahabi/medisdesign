import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { articles } from '@/content/site';
import { articleDates, journal } from '@/content/journal';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa, faDate, isoDay } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'مدیس مگ | یادداشت‌هایی دربارهٔ صدا و فضا',
  description: 'مقالات گروه مهندسی مدیس دربارهٔ آکوستیک، عایق صوتی، دیفیوزر، بیس‌ترپ و طراحی فضا.',
  path: '/magazine/',
});

/* the four full articles, in journal order */
const order = ['acoustics', 'sound-insulation', 'fire-coating', 'acoustic-architecture'];

const featured = order.map((slug) => {
  const article = articles.find((a) => a.slug === slug)!;
  const iso = articleDates[slug];
  return { ...article, iso, label: faDate(iso), day: isoDay(iso) };
});

const byTitle = new Map(articles.map((a) => [a.title, a.slug]));

export default function MagazinePage() {
  return (
    <>
      <PageLd
        path="/magazine/"
        name="مدیس مگ | یادداشت‌هایی دربارهٔ صدا و فضا"
        description="مقالات گروه مهندسی مدیس دربارهٔ آکوستیک، عایق صوتی، دیفیوزر، بیس‌ترپ و طراحی فضا."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'مدیس مگ' }]}
      />

      <main id="main">
        <PageHero
          en="journal"
          fa="مجله"
          h1="مدیس مگ"
          lede="یادداشت‌هایی دربارهٔ صدا، عایق و فضایی که می‌سازیم."
        />

        <section className="sec tight" id="latest" aria-labelledby="latest-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="latest"
              fa="تازه‌ها"
              id="latest-h"
              title="چهار مقالهٔ کامل"
              note="متن این چهار مقاله در همین مجموعه منتشر شده است."
            />

            <div className="mag-grid">
              {featured.map((article, i) => (
                <Link
                  key={article.slug}
                  className="mag-item reveal"
                  href={`/magazine/${article.slug}/`}
                  style={{ '--d': `${(i % 2) * 0.05}s` } as CSSProperties}
                >
                  <div className="mag-thumb">
                    <Picture jpg={article.img} width={320} height={320} alt={article.alt} />
                  </div>
                  <div className="mag-text">
                    <span className="mag-top">
                      <span className="idx">{fa(i + 1)}</span>
                      <time dateTime={article.day}>{article.label}</time>
                    </span>
                    <h3>{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="archive" aria-labelledby="journal-archive-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="archive"
              fa="آرشیو"
              id="journal-archive-h"
              title="آرشیو مجله"
              note="فهرست عنوان‌های منتشرشده در مدیس مگ؛ تاریخ‌ها از خود سایت است."
            />

            <div className="rows">
              {journal
                .filter((row) => byTitle.has(row.title))
                .map((row, i) => {
                  const slug = byTitle.get(row.title)!;
                  return (
                    <Link key={row.title} className="row" href={`/magazine/${slug}/`}>
                      <span className="idx">{fa(i + 1)}</span>
                      <h3>{row.title}</h3>
                      <time dateTime={row.date}>{faDate(row.date)}</time>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>

        <Cta n="۰۳" h2="سؤالی دربارهٔ آکوستیک دارید؟" en="dialogue" fa="پرسش" />
      </main>
    </>
  );
}
