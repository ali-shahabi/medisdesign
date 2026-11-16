import type { Metadata } from 'next';
import { aboutStory } from '@/content/site';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { SecHead } from '@/components/Section';
import { Partners, StatsBand } from '@/components/Sections';
import { TextLink } from '@/components/TextLink';
import { Picture } from '@/components/Picture';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'درباره ما | گروه مهندسی مدیس',
  description: 'گروه مهندسی مدیس؛ آکوستیک، الکتروآکوستیک و معماری. از سال ۱۳۹۵ تا امروز، با ادغام علم آکوستیک، معماری و هنر.',
  path: '/about/',
  image: '/assets/img/service-06.jpg',
  imageW: 1741,
  imageH: 945,
  imageAlt: 'نمونه‌های روکش چوب برای پوشش آکوستیک',
});

export default function AboutPage() {
  return (
    <>
      <PageLd
        path="/about/"
        name="درباره ما | گروه مهندسی مدیس"
        description="گروه مهندسی مدیس؛ آکوستیک، الکتروآکوستیک و معماری. از سال ۱۳۹۵ تا امروز."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'درباره ما' }]}
      />

      <main id="main">
        <PageHero
          en="about"
          fa="درباره ما"
          h1="دو دهه تمایز"
          lede="گروه مهندسی مدیس در سه میدان کار می‌کند: معماری، آکوستیک و الکتروآکوستیک."
          narrow
          actions={<TextLink href="/projects/">دیدن پروژه‌ها</TextLink>}
          art={
            <figure className="frame">
              <Picture
                webp={[
                  { src: '/assets/img/service-06-560.webp', w: 560 },
                  { src: '/assets/img/service-06-1120.webp', w: 1120 },
                ]}
                jpg="/assets/img/service-06.jpg"
                width={1800}
                height={972}
                alt="نمونه‌های روکش چوب برای پوشش آکوستیک"
                sizes="(max-width: 900px) 90vw, 420px"
              />
            </figure>
          }
        />

        <section className="sec tight" id="story" aria-labelledby="story-h">
          <div className="wrap">
            <div className="art-in">
              <div className="art-body">
                <SecHead n="۰۱" en="story" fa="معرفی" id="story-h" title="از ۱۳۹۵ تا امروز" />
                <div className="prose">
                  {aboutStory.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <aside className="art-side">
                <dl className="art-meta">
                  <div>
                    <dt>زمینه</dt>
                    <dd>آکوستیک معماری</dd>
                  </div>
                  <div>
                    <dt>زمینه</dt>
                    <dd>الکتروآکوستیک</dd>
                  </div>
                  <div>
                    <dt>زمینه</dt>
                    <dd>معماری داخلی</dd>
                  </div>
                  <div>
                    <dt>خدمات</dt>
                    <dd>طراحی، مشاوره، نظارت، اجرا</dd>
                  </div>
                </dl>
                <div className="quote">
                  <p>ما در تمام مراحل پروژه کنار شما هستیم …!</p>
                  <span className="latin" lang="en">
                    medis design group
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <StatsBand n="۰۲" />

        <Partners />

        <Cta n="۰۴" />
      </main>
    </>
  );
}
