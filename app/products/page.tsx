import type { Metadata } from 'next';
import Link from 'next/link';
import { catalogue, colourFile, families, familyModels, models, woodColours } from '@/content/products';
import { Asset } from '@/components/Asset';
import { Cta } from '@/components/Cta';
import { Arrow } from '@/components/Icons';
import { PageHero } from '@/components/PageHero';
import { PageLd } from '@/components/PageLd';
import { Eyebrow, SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'محصولات آکوستیک ـ دکوراتیو | گروه مهندسی مدیس',
  description:
    'سیزده مدل جاذب صدا، بیس‌ترپ، پنل سالن، تایل چوبی و صندلی؛ با ابعاد، وزن، کاربرد و منحنی ضریب جذب از کاتالوگ مدیس.',
  path: '/products/',
});

export default function ProductsPage() {
  return (
    <>
      <PageLd
        path="/products/"
        name="محصولات آکوستیک ـ دکوراتیو | گروه مهندسی مدیس"
        description="سیزده مدل جاذب صدا، بیس‌ترپ، پنل سالن، تایل چوبی و صندلی، با مشخصات فنی کامل."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'محصولات' }]}
      />

      <main id="main">
        <PageHero
          en="products"
          fa="محصولات"
          h1="محصولات آکوستیک ـ دکوراتیو"
          lede={`${fa(models.length)} مدل در پنج خانواده؛ با ابعاد، وزن، کاربرد و منحنی ضریب جذب — همان‌طور که در کاتالوگ چاپی آمده است.`}
          actions={
            <>
              <Link className="btn" href="/contact/">
                درخواست نمونه
              </Link>
              <TextLink href="/catalog/">کاتالوگ محصولات</TextLink>
            </>
          }
        />

        <section className="sec tight" id="families" aria-labelledby="families-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="families"
              fa="خانواده‌ها"
              id="families-h"
              title="پنج خانوادهٔ محصول"
              note="هر ردیف، یک مدل با کد مشخص است؛ روی مدل بزنید تا شناسنامهٔ فنی و منحنی جذب را ببینید."
            />

            <div className="fam-list">
              {families.map((family) => {
                const rows = familyModels(family.id);
                return (
                  <section className="fam" id={family.id} key={family.id} aria-labelledby={`fam-${family.id}`}>
                    <div className="fam-head">
                      <span className="fam-n">{family.n}</span>
                      <div>
                        <Eyebrow en={family.en} fa={family.title} />
                        <h3 id={`fam-${family.id}`}>{family.title}</h3>
                        <p>{family.intro}</p>
                      </div>
                    </div>

                    {rows.length ? (
                      <ul className="fam-models">
                        {rows.map((m) => (
                          <li key={m.slug}>
                            <Link className="model-row" href={`/products/${m.slug}/`}>
                              <span className="mr-img">
                                <Asset src={m.photo} width={m.photoW} height={m.photoH} alt={m.alt} />
                              </span>
                              <span className="mr-txt">
                                <span className="latin" lang="en">
                                  {m.code}
                                </span>
                                <b>{m.title}</b>
                                <span className="mr-meta">
                                  {m.dims.length ? m.dims[0] : m.weight ? `وزن ${m.weight}` : m.use[0]}
                                </span>
                              </span>
                              <span className="go" aria-hidden="true">
                                <Arrow />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="fam-models">
                        <li>
                          <Link className="model-row" href="/products/chairs/">
                            <span className="mr-img">
                              <Asset
                                src="/assets/img/spec/chair-3.webp"
                                width={273}
                                height={354}
                                alt="صندلی همایشی با دستهٔ تحریر"
                              />
                            </span>
                            <span className="mr-txt">
                              <span className="latin" lang="en">
                                chairs
                              </span>
                              <b>صندلی همایشی و سینما</b>
                              <span className="mr-meta">متریال، مکانیزم و ساخت سفارشی</span>
                            </span>
                            <span className="go" aria-hidden="true">
                              <Arrow />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="colours" aria-labelledby="colours-h">
          <div className="wrap">
            <div className="split">
              <div className="split-txt">
                <SecHead
                  n="۰۲"
                  en="finishes"
                  fa="رنگ"
                  id="colours-h"
                  title="۱۶ کد رنگ چوب"
                  note="رنگ نانو، سطح را آب‌گریز می‌کند؛ هر کد روی نمونهٔ چوب اجرا می‌شود."
                />
                <ul className="swatch-row mt-[26px]">
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
                <div className="ph-actions mt-[26px]">
                  <TextLink href="/products/colours/">همهٔ کدهای رنگ</TextLink>
                  <TextLink href="/contact/">درخواست نمونه</TextLink>
                </div>
              </div>
              <div className="split-fig">
                <figure>
                  <div className="frame">
                    <Asset
                      src="/assets/img/spec/wood-bg.webp"
                      width={1190}
                      height={712}
                      alt="دیوار پوشیده از تایل چوبی سه‌بعدی در یک فضای مسکونی"
                    />
                  </div>
                  <figcaption className="material-cap">
                    <span className="latin" lang="en">
                      wood colours
                    </span>
                    <span className="fa">تایل دکوراتیو</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <Cta
          n="۰۳"
          h2="کاتالوگ محصولات"
          en="catalogue"
          fa="کاتالوگ"
          text={`${fa(catalogue.pages)} صفحه، شش فصل؛ همین حالا قابل دانلود است.`}
          more={
            <Link className="c-site" href="/catalog/">
              catalogue
            </Link>
          }
        />
      </main>
    </>
  );
}