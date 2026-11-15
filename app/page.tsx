import type { Metadata } from 'next';
import Link from 'next/link';
import { articles, homeArticles, products, projects, services } from '@/content/site';
import { articleDates } from '@/content/journal';
import { Arrow, ServiceIcon } from '@/components/Icons';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { Picture } from '@/components/Picture';
import { Partners, Process, StatsBand } from '@/components/Sections';
import { Eyebrow, Field, Mark, SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa, faDate, projectImage, serviceImage, isoDay } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'گروه مهندسی مدیس | طراحی آکوستیک، سالن همایش و سینما',
  description:
    'طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی؛ تحلیل، طراحی و اجرا در یک پیوستار.',
  path: '/',
});

const homeOrder = ['alavi', 'baharestan', 'araz', 'datin-cinema', 'datin-conference', 'mosque', 'dey', 'kimiafam'];

const mag = homeArticles.map((slug) => {
  const article = articles.find((a) => a.slug === slug)!;
  const iso = articleDates[slug];
  return { ...article, iso, label: faDate(iso), day: isoDay(iso) };
});

export default function HomePage() {
  return (
    <>
      <PageLd
        path="/"
        name="گروه مهندسی مدیس | طراحی آکوستیک، سالن همایش و سینما"
        description="طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }]}
      />

      <main id="main">
        {/* ================= HERO ================= */}
        <section className="hero" id="top" aria-labelledby="hero-h">
          <Field className="hero-field" drift="0.055" turn="0.005" />

          <div className="wrap hero-in">
            <div className="hero-copy col-span-6 max-[1180px]:col-span-8 max-[900px]:col-span-1">
              <Eyebrow en="acoustic ecology" fa="طراحی آکوستیک" />

              <h1 id="hero-h">
                <span className="h1-kicker">طراحی آکوستیک سالن همایش و سینما</span>
                <span>آرامش،</span>
                <span>شنیده می‌شود</span>
              </h1>

              <p className="hero-tagline">طراحی سالن همایش، تلفیقی از هنر و علم</p>
              <p className="hero-lede">
                طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی.
              </p>

              <div className="hero-meta">
                <p className="disc-line">
                  <span>معماری</span>
                  <i aria-hidden="true">·</i>
                  <span>آکوستیک</span>
                  <i aria-hidden="true">·</i>
                  <span>الکتروآکوستیک</span>
                </p>
                <div className="hero-actions flex items-center gap-[18px] flex-wrap">
                  <a className="btn small" href="#contact">
                    شروع گفت‌وگو
                  </a>
                  <TextLink href="#projects">دیدن پروژه‌ها</TextLink>
                </div>
              </div>
            </div>

            <div className="hero-plate col-span-6 max-[1180px]:col-span-4 max-[900px]:col-span-1">
              <figure>
                <div className="frame">
                  <Picture
                    webp={[
                      { src: '/assets/img/hall-green-640.webp', w: 640 },
                      { src: '/assets/img/hall-green-1280.webp', w: 1280 },
                    ]}
                    jpg="/assets/img/hall-green.jpg"
                    width={1280}
                    height={720}
                    priority
                    alt="نمای داخلی سالن همایش با صندلی‌های سبز، پوشش چوبی دیوار و نورپردازی خطی سقف"
                    sizes="(max-width: 900px) 90vw, 640px"
                  />
                </div>
                <figcaption className="plate-cap">
                  <span className="latin" lang="en">
                    hall study
                  </span>
                  <span className="fa">سالن، نمای داخلی</span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="wrap hero-foot">
            <p>دو دهه تمایز</p>
            <a className="scroll-cue" href="#about">
              <span className="latin" lang="en">
                scroll
              </span>
              <span className="line" aria-hidden="true">
                <span className="dot" />
              </span>
            </a>
          </div>
        </section>

        {/* ================= 01 · STATEMENT ================= */}
        <section className="sec petrol" id="about" aria-labelledby="about-h">
          <div className="wrap">
            <div className="sec-head reveal">
              <Mark n="۰۱" />
              <div className="sec-title">
                <Eyebrow en="field note" fa="درباره ما" />
                <h2 id="about-h">دو دهه تمایز</h2>
              </div>
            </div>

            <div className="stmt-in grid grid-cols-12 gap-6 max-[900px]:block">
              <div className="stmt-main col-span-7 max-[1180px]:col-span-8">
                <p className="lead reveal">
                  گروه مهندسی مدیس در سه میدان کار می‌کند: معماری، آکوستیک و الکتروآکوستیک. کار از تحلیل رفتار صدا در فضا
                  آغاز می‌شود و با طراحی، اجرا و تحویل، به فضایی می‌رسد که می‌توان در آن شنید.
                </p>
                <p className="body reveal">
                  طراحی آکوستیک، الکتروآکوستیک و معماری سالن‌های همایش، سینما و فضاهای فرهنگی؛ همراه با ساخت محصولات
                  آکوستیک ـ دکوراتیو برای سقف، کف و دیوار. تحلیل، طراحی و اجرا در یک پیوستار، از اولین اندازه‌گیری تا
                  آخرین پنل.
                </p>
              </div>

              <aside className="stmt-side col-start-9 col-span-4 max-[1180px]:col-span-4 max-[1180px]:pt-10">
                <div className="quote reveal">
                  <p>از اولین اندازه‌گیری تا آخرین پنل.</p>
                  <span className="latin" lang="en">
                    medis design group
                  </span>
                </div>
                <ul className="disc reveal" role="list">
                  <li>
                    <span>معماری</span>
                    <span className="latin" lang="en">
                      architecture
                    </span>
                  </li>
                  <li>
                    <span>آکوستیک</span>
                    <span className="latin" lang="en">
                      acoustic
                    </span>
                  </li>
                  <li>
                    <span>الکتروآکوستیک</span>
                    <span className="latin" lang="en">
                      electroacoustic
                    </span>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        {/* ================= 02 · SERVICES ================= */}
        <section className="sec alt" id="services" aria-labelledby="services-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="six practices"
              fa="خدمات"
              id="services-h"
              title="خدمات ما"
              note="از تحلیل فضا تا ساخت پنل؛ هر خدمت، ادامهٔ دیگری است. شش میدان، یک زبان مشترک."
            />

            <div className="svc-grid">
              {services.map((service, i) => (
                <Link
                  className="card reveal"
                  href={`/services/${service.slug}/`}
                  key={service.slug}
                  style={{ '--d': `${(i % 3) * 0.06}s` } as React.CSSProperties}
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
                    <p>{service.short}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="sec-more">
              <TextLink href="/services/">همهٔ خدمات</TextLink>
            </div>
          </div>
        </section>

        <Process />

        {/* ================= 04 · PROJECTS ================= */}
        <section className="sec sky" id="projects" aria-labelledby="projects-h">
          <div className="wrap">
            <SecHead n="۰۴" en="selected works" fa="پروژه‌ها" id="projects-h" title="پروژه‌های ما" />

            <div className="plates">
              {homeOrder.map((slug, i) => {
                const project = projects.find((p) => p.slug === slug)!;
                const size = i < 2 ? 'half' : 'third';
                return (
                  <figure
                    className={`plate ${size} reveal ${size === 'half' ? 'col-span-6 max-[700px]:col-span-2' : 'col-span-3 max-[700px]:col-span-1'}`}
                    key={project.slug}
                    style={{ '--d': `${(i % 4) * 0.05}s` } as React.CSSProperties}
                  >
                    <Link className="ph" href={`/projects/${project.slug}/`}>
                      <Picture
                        {...projectImage(project.img)}
                        width={project.width}
                        height={project.height}
                        alt={`${project.name}، ${project.type}`}
                        sizes={
                          size === 'half'
                            ? '(max-width: 700px) 92vw, (max-width: 1180px) 62vw, 640px'
                            : '(max-width: 700px) 46vw, (max-width: 1180px) 30vw, 300px'
                        }
                      />
                    </Link>
                    <figcaption>
                      <h3>{project.name}</h3>
                    </figcaption>
                  </figure>
                );
              })}

              <div className="plate-cta reveal col-span-6 max-[700px]:col-span-2" style={{ '--d': '0.05s' } as React.CSSProperties}>
                <b>همهٔ پروژه‌ها</b>
                <p>۴۲ پروژه تکمیل شده؛ سالن، سینما، مسجد، ساختمان اداری و فضای فرهنگی.</p>
                <TextLink href="/projects/">مشاهدهٔ آرشیو</TextLink>
              </div>
            </div>
          </div>
        </section>

        <StatsBand n="۰۵" />

        {/* ================= 06 · PRODUCTS ================= */}
        <section className="sec" id="products" aria-labelledby="products-h">
          <div className="wrap">
            <SecHead
              n="۰۶"
              en="materials"
              fa="محصولات"
              id="products-h"
              title="محصولات آکوستیک ـ دکوراتیو"
              note="پوشش‌ها، جاذب‌ها و دیفیوزرها؛ همان موادی که فضا را نرم می‌کنند."
            />

            <div className="prod-grid grid grid-cols-12 gap-6 max-[900px]:block">
              <div className="chips col-span-6 max-[1180px]:col-span-7">
                {products.map((product, i) => (
                  <Link
                    className="chip reveal"
                    href={`/products/#${product.id}`}
                    key={product.id}
                    style={{ '--d': `${i * 0.05}s` } as React.CSSProperties}
                  >
                    <Picture
                      webp={[{ src: `/assets/img/panel-${product.img}.webp` }]}
                      jpg={`/assets/img/panel-${product.img}.jpg`}
                      width={product.img === 1 ? 182 : 165}
                      height={product.img === 1 ? 103 : 99}
                      alt={product.alt}
                    />
                    <div>
                      <h3>{product.title}</h3>
                      <p>{product.line}</p>
                    </div>
                    <span className="go" aria-hidden="true">
                      <Arrow />
                    </span>
                  </Link>
                ))}

                <div className="cat" id="catalog">
                  <span className="latin" lang="en">
                    catalogues
                  </span>
                  <TextLink href="/catalog/">درخواست کاتالوگ محصولات</TextLink>
                </div>
              </div>

              <div className="material col-start-8 col-span-5 reveal">
                <figure>
                  <div className="frame">
                    <Picture
                      webp={[
                        { src: '/assets/img/service-06-560.webp', w: 560 },
                        { src: '/assets/img/service-06-1120.webp', w: 1120 },
                      ]}
                      jpg="/assets/img/service-06.jpg"
                      width={1800}
                      height={972}
                      alt="نمونه‌های روکش چوب در رنگ‌های طبیعی، برای پوشش‌های آکوستیک"
                      sizes="(max-width: 900px) 90vw, (max-width: 1180px) 38vw, 530px"
                    />
                  </div>
                  <figcaption className="material-cap">
                    <span className="latin" lang="en">
                      wood veneer samples
                    </span>
                    <span className="fa">نمونه‌های پوشش</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <Partners />

        {/* ================= 08 · MAGAZINE ================= */}
        <section className="sec sky" id="magazine" aria-labelledby="magazine-h">
          <div className="wrap">
            <SecHead
              n="۰۸"
              en="journal"
              fa="مجله"
              id="magazine-h"
              title="مدیس مگ"
              note="یادداشت‌هایی دربارهٔ صدا، عایق و فضایی که می‌سازیم."
            />

            <div className="mag-grid">
              {mag.map((article, i) => (
                <Link
                  className="mag-item reveal"
                  href={`/magazine/${article.slug}/`}
                  key={article.slug}
                  style={{ '--d': `${(i % 2) * 0.05}s` } as React.CSSProperties}
                >
                  <div className="mag-thumb">
                    <Picture
                      webp={[
                        { src: `/assets/img/mag/mag-${article.thumb}-160.webp`, w: 160 },
                        { src: `/assets/img/mag/mag-${article.thumb}-320.webp`, w: 320 },
                      ]}
                      jpg={`/assets/img/mag/mag-${article.thumb}-320.jpg`}
                      width={320}
                      height={320}
                      alt={article.title}
                      sizes="96px"
                    />
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

            <div className="sec-more">
              <TextLink href="/magazine/">همهٔ مقالات</TextLink>
            </div>
          </div>
        </section>

        {/* ================= 09 · CONTACT ================= */}
        <Cta n="۰۹" h2="در تماس باشید" en="dialogue" fa="تماس" id="contact" labelId="contact-h" showActions={false} tight={false} />
      </main>
    </>
  );
}
