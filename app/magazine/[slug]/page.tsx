import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/content/site';
import { articleBodies, articleDates } from '@/content/journal';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { TextLink } from '@/components/TextLink';
import { asset, faDate, isoDay } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return pageMeta({
    title: `${article.title} | مدیس مگ`,
    description: article.intro,
    path: `/magazine/${article.slug}/`,
    image: article.img,
    imageW: article.imgW,
    imageH: article.imgH,
    imageAlt: article.alt,
  });
}

/* next-article chain, in journal order */
const order = ['acoustics', 'sound-insulation', 'fire-coating', 'acoustic-architecture'];

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article || !articleBodies[slug]) notFound();
  const body = articleBodies[slug];
  const iso = articleDates[slug];
  const next = articles.find((a) => a.slug === order[(order.indexOf(slug) + 1) % order.length])!;

  return (
    <>
      <PageLd
        path={`/magazine/${article.slug}/`}
        name={`${article.title} | مدیس مگ`}
        description={article.intro}
        crumbs={[
          { name: 'صفحه اصلی', path: '/' },
          { name: 'مدیس مگ', path: '/magazine/' },
          { name: article.title },
        ]}
      />

      <main id="main">
        <PageHero
          en="journal"
          fa="مقاله"
          h1={article.title}
          lede={article.intro}
          narrow
        />

        <section className="sec tight" id="article" aria-labelledby="article-h">
          <div className="wrap">
            <div className="art-in">
              <div className="art-body">
                <figure className="art-hero mt-0">
                  <img
                    src={asset(article.img)}
                    width={article.imgW}
                    height={article.imgH}
                    loading="lazy"
                    decoding="async"
                    alt={article.alt}
                  />
                </figure>
                {/* body HTML is generated from data/posts.json by scripts/build-content.mjs */}
                <div className="prose mt-[40px]" dangerouslySetInnerHTML={{ __html: body }} />
                <div className="ph-actions mt-[44px]">
                  <Link className="btn" href="/contact/">
                    مشاورهٔ تخصصی
                  </Link>
                  <TextLink href="/magazine/">بازگشت به مدیس مگ</TextLink>
                </div>
              </div>

              <aside className="art-side">
                <dl className="art-meta">
                  <div>
                    <dt>تاریخ</dt>
                    <dd>
                      <time dateTime={isoDay(iso)}>{faDate(iso)}</time>
                    </dd>
                  </div>
                  <div>
                    <dt>دسته</dt>
                    <dd>آکوستیک</dd>
                  </div>
                  <div>
                    <dt>منبع</dt>
                    <dd>مدیس مگ</dd>
                  </div>
                </dl>
                <div className="quote">
                  <p>از اولین اندازه‌گیری تا آخرین پنل.</p>
                  <span className="latin" lang="en">
                    medis design group
                  </span>
                </div>
                <TextLink href={`/magazine/${next.slug}/`} className="mt-[24px]">
                  مقالهٔ بعدی: {next.title}
                </TextLink>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
