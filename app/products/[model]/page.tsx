import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  colourFile,
  families,
  familyModels,
  findModel,
  models,
  woodColours,
} from '@/content/products';
import { Asset } from '@/components/Asset';
import { Cta } from '@/components/Cta';
import { PageHero } from '@/components/PageHero';
import { PageLd } from '@/components/PageLd';
import { ProductLd } from '@/components/ProductLd';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { pageMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return models.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model: slug } = await params;
  const model = findModel(slug);
  if (!model) return {};
  return pageMeta({
    title: `${model.title} — ${model.code} | محصولات گروه مهندسی مدیس`,
    description: `${model.code} — ${model.line} ابعاد، وزن، کاربرد و منحنی ضریب جذب، از کاتالوگ مدیس.`,
    path: `/products/${model.slug}/`,
  });
}

export default async function ProductModelPage({ params }: { params: Promise<{ model: string }> }) {
  const { model: slug } = await params;
  const model = findModel(slug);
  if (!model) notFound();

  const family = families.find((f) => f.id === model.family);
  const siblings = familyModels(model.family).filter((m) => m.slug !== model.slug);
  const title = model.title;
  const fullTitle = `${model.title} — ${model.code}`;

  /* section numbers follow whichever sections actually render */
  const nums = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶'];
  let cursor = 0;
  const nSpec = nums[cursor++];
  const nCurve = nums[cursor++];
  const nAbout = model.body.length ? nums[cursor++] : undefined;
  const nColours = model.colours ? nums[cursor++] : undefined;
  const nRelated = siblings.length ? nums[cursor++] : undefined;
  const nCta = nums[cursor++];

  return (
    <>
      <PageLd
        path={`/products/${model.slug}/`}
        name={`${fullTitle} | گروه مهندسی مدیس`}
        description={model.line}
        crumbs={[
          { name: 'صفحه اصلی', path: '/' },
          { name: 'محصولات', path: '/products/' },
          { name: model.code },
        ]}
      />
      <ProductLd model={model} />

      <main id="main">
        <PageHero
          en={model.code.toLowerCase()}
          fa={family?.title ?? 'محصول'}
          h1={title}
          lede={model.line}
          actions={
            <>
              <Link className="btn" href="/contact/">
                درخواست برگهٔ فنی
              </Link>
              <TextLink href="/products/">همهٔ محصولات</TextLink>
            </>
          }
        />

        <section className="sec tight" id="spec" aria-labelledby="spec-h">
          <div className="wrap">
            <SecHead
              n={nSpec}
              en="specification"
              fa="شناسنامه"
              id="spec-h"
              title="شناسنامهٔ فنی"
            />

            <div className="spec-in">
              <figure className="spec-fig">
                <Asset
                  src={model.photo}
                  width={model.photoW}
                  height={model.photoH}
                  alt={model.alt}
                  priority
                />
                <figcaption className="spec-cap">
                  <span className="latin" lang="en">
                    {model.code}
                  </span>
                  <span className="fa">{family?.title}</span>
                </figcaption>
              </figure>

              <div className="spec-copy">
                <dl className="kv spec-kv">
                  <div>
                    <dt>مدل</dt>
                    <dd>
                      <span className="latin" lang="en">
                        {model.code}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>خانواده</dt>
                    <dd className="plain">{family?.title}</dd>
                  </div>
                  {model.dims.length ? (
                    <div>
                      <dt>ابعاد</dt>
                      <dd>
                        {model.dims.map((d) => (
                          <span key={d} className="spec-dim">
                            {d}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                  {model.weight ? (
                    <div>
                      <dt>وزن</dt>
                      <dd>{model.weight}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>کاربرد</dt>
                    <dd className="plain">{model.use.join('، ')}</dd>
                  </div>
                  {model.install ? (
                    <div>
                      <dt>روش نصب</dt>
                      <dd className="plain">{model.install}</dd>
                    </div>
                  ) : null}
                </dl>
                {model.dimsNote ? <p className="spec-note">{model.dimsNote}</p> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="curve" aria-labelledby="curve-h">
          <div className="wrap">
            <SecHead n={nCurve} en="absorption" fa="منحنی" id="curve-h" title="ضریب جذب صدا" />
            {model.charts.map((chart) => (
              <figure key={chart.src} className="chart-fig reveal">
                <Asset src={chart.src} width={chart.w} height={chart.h} alt={`منحنی ضریب جذب ${model.code}`} />
                <figcaption className="chart-cap">{chart.label}</figcaption>
              </figure>
            ))}
            <p className="chart-note">
              محور افقی فرکانس (۱۲۵ تا ۵۰۰۰ هرتز) و محور عمودی ضریب جذب است. منحنی‌ها همان‌طور که در کاتالوگ چاپی
              آمده‌اند بازتولید شده‌اند؛ برای تفسیر پروژه‌ای، تیم آکوستیک مدیس طراحی را بر اساس فضای شما انجام می‌دهد.
            </p>
          </div>
        </section>

        {model.body.length ? (
          <section className="sec tight" id="about" aria-labelledby="about-h">
            <div className="wrap">
              <SecHead n={nAbout} en="about" fa="توضیحات" id="about-h" title="دربارهٔ این مدل" />
              <div className="prose">
                {model.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {model.colours ? (
          <section className="sec tight" id="colours" aria-labelledby="colours-h">
            <div className="wrap">
              <SecHead
                n={nColours}
                en="finishes"
                fa="رنگ"
                id="colours-h"
                title="رنگ‌بندی چوب"
                note="۱۶ کد رنگ در کاتالوگ؛ هر کد روی نمونهٔ چوب اجرا می‌شود."
              />
              <ul className="swatch-row">
                {woodColours.map((code) => (
                  <li key={code}>
                    <Link href="/products/colours/" className="swatch-mini">
                      <Asset src={colourFile(code)} width={340} height={272} alt={`نمونهٔ رنگ چوب کد ${code}`} />
                      <span className="latin" lang="en">
                        {code}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="spec-note">
                <TextLink href="/products/colours/">همهٔ کدهای رنگ، با نمونهٔ بزرگ</TextLink>
              </p>
            </div>
          </section>
        ) : null}

        {siblings.length ? (
          <section className="sec alt tight" id="related" aria-labelledby="related-h">
            <div className="wrap">
              <SecHead n={nRelated} en="same family" fa="خانواده" id="related-h" title="مدل‌های دیگر این خانواده" />
              <div className="cards-2">
                {siblings.map((m) => (
                  <Link key={m.slug} className="tile model-card reveal" href={`/products/${m.slug}/`}>
                    <span className="mc-img">
                      <Asset src={m.photo} width={m.photoW} height={m.photoH} alt={m.alt} />
                    </span>
                    <span className="tile-top">
                      <span className="latin" lang="en">
                        {m.code}
                      </span>
                    </span>
                    <h3>{m.title}</h3>
                    <p>{m.line}</p>
                    <span className="link mt-auto pt-[18px]">مشخصات فنی</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <Cta
          n={nCta}
          h2="نمونه یا برگهٔ فنی می‌خواهید؟"
          en="quote"
          fa="درخواست"
          text="برای همین مدل، ابعاد سفارشی، رنگ یا نمونهٔ فیزیکی، یک تماس کافی است."
          more={
            <Link className="c-site" href="/products/">
              all products
            </Link>
          }
        />
      </main>
    </>
  );
}