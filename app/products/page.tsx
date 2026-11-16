import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { products } from '@/content/site';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'محصولات آکوستیک ـ دکوراتیو | گروه مهندسی مدیس',
  description: 'جاذب‌های صدا، دیفیوزرها، بیس‌ترپ و پوشش‌های دکوراتیو آکوستیک برای سقف، کف و دیوار.',
  path: '/products/',
});

const widths = [182, 165, 165, 165];
const heights = [103, 99, 99, 99];

export default function ProductsPage() {
  return (
    <>
      <PageLd
        path="/products/"
        name="محصولات آکوستیک ـ دکوراتیو | گروه مهندسی مدیس"
        description="جاذب‌های صدا، دیفیوزرها، بیس‌ترپ و پوشش‌های دکوراتیو آکوستیک برای سقف، کف و دیوار."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'محصولات' }]}
      />

      <main id="main">
        <PageHero
          en="materials"
          fa="محصولات"
          h1="محصولات آکوستیک ـ دکوراتیو"
          lede="پوشش‌ها، جاذب‌ها و دیفیوزرها؛ همان موادی که فضا را نرم می‌کنند. چهار خانوادهٔ محصول، یک زبان طراحی."
          actions={<TextLink href="/catalog/">درخواست کاتالوگ محصولات</TextLink>}
        />

        <section className="sec tight" id="families" aria-labelledby="families-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="families"
              fa="چهار خانواده"
              id="families-h"
              title="چهار خانوادهٔ محصول"
              note="توضیح‌ها همان یک‌خطی‌های واقعی سایت است؛ بدون ضخامت، درجهٔ حریق یا ضریب جذب."
            />

            <div className="cards-2">
              {products.map((product, i) => (
                <article
                  key={product.id}
                  className="card reveal"
                  id={product.id}
                  style={{ '--d': `${(i % 2) * 0.05}s` } as CSSProperties}
                >
                  <div className="card-img">
                    <Picture
                      webp={[{ src: `/assets/img/panel-${product.img}.webp` }]}
                      jpg={`/assets/img/panel-${product.img}.jpg`}
                      width={widths[i]}
                      height={heights[i]}
                      alt={product.alt}
                      sizes="(max-width: 900px) 92vw, 560px"
                    />
                  </div>
                  <div className="card-body">
                    <span className="card-top">
                      <span className="card-n">{fa(i + 1)}</span>
                      <span className="latin" lang="en">
                        acoustic product
                      </span>
                    </span>
                    <h3>{product.title}</h3>
                    <p>{product.line}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="material" aria-labelledby="material-h">
          <div className="wrap">
            <div className="split">
              <div className="split-txt">
                <SecHead n="۰۲" en="material" fa="متریال" id="material-h" title="روکش، رنگ، بافت" />
                <p className="lead mt-[22px]">
                  سطح محصول، بخشی از طراحی است: روکش چوب، رنگ و بافت، همان‌قدر که جذب و پخش صدا مهم است، در دیده‌شدن
                  فضا اثر می‌گذارد.
                </p>
                <div className="ph-actions mt-[26px]">
                  <TextLink href="/catalog/">کاتالوگ‌ها</TextLink>
                  <TextLink href="/contact/">درخواست نمونه</TextLink>
                </div>
              </div>
              <div className="split-fig">
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
                      sizes="(max-width: 900px) 90vw, 520px"
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

        <Cta
          n="۰۳"
          h2="کاتالوگ را بفرستیم؟"
          en="catalogues"
          fa="کاتالوگ"
          text="چهار کاتالوگ چاپی؛ با یک تماس یا ایمیل ارسال می‌شود."
          more={
            <Link className="c-site" href="/catalog/">
              catalog
            </Link>
          }
        />
      </main>
    </>
  );
}
