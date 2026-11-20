import type { Metadata } from 'next';
import Link from 'next/link';
import { colourFile, woodColours } from '@/content/products';
import { Asset } from '@/components/Asset';
import { Cta } from '@/components/Cta';
import { PageHero } from '@/components/PageHero';
import { PageLd } from '@/components/PageLd';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { fa } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'کدهای رنگ چوب | محصولات گروه مهندسی مدیس',
  description:
    'شانزده کد رنگ چوب برای تایل‌ها و پنل‌های آکوستیک مدیس؛ هر کد روی نمونهٔ چوب اجرا می‌شود و در کاتالوگ محصولات آمده است.',
  path: '/products/colours/',
});

export default function ColoursPage() {
  return (
    <>
      <PageLd
        path="/products/colours/"
        name="کدهای رنگ چوب | گروه مهندسی مدیس"
        description="شانزده کد رنگ چوب برای تایل‌ها و پنل‌های آکوستیک مدیس."
        crumbs={[
          { name: 'صفحه اصلی', path: '/' },
          { name: 'محصولات', path: '/products/' },
          { name: 'رنگ‌ها' },
        ]}
      />

      <main id="main">
        <PageHero
          en="colours"
          fa="رنگ"
          h1="کدهای رنگ چوب"
          lede={`${fa(woodColours.length)} کد رنگ برای تایل‌ها و پنل‌های آکوستیک؛ روی نمونهٔ چوب اجرا می‌شود و همراه کاتالوگ محصولات منتشر شده است.`}
          actions={
            <>
              <Link className="btn" href="/contact/">
                درخواست نمونهٔ رنگ
              </Link>
              <TextLink href="/products/">همهٔ محصولات</TextLink>
            </>
          }
        />

        <section className="sec tight" id="palette" aria-labelledby="palette-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="palette"
              fa="رنگ‌ها"
              id="palette-h"
              title="شانزده کد، شانزده بافت"
              note="کد را برای نمونه در پیام بنویسید؛ نمونهٔ فیزیکی چوب ارسال می‌شود."
            />

            <ul className="swatches">
              {woodColours.map((code) => (
                <li key={code} className="swatch">
                  <span className="swatch-img">
                    <Asset src={colourFile(code)} width={340} height={272} alt={`نمونهٔ رنگ چوب، کد ${code}`} />
                  </span>
                  <span className="swatch-meta">
                    <span className="latin" lang="en">
                      {code}
                    </span>
                    <span className="swatch-label">کد رنگ</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="swatch-note">
              <p>
                از این رنگ‌ها با تکنولوژی نانو استفاده می‌شود؛ سطح تایل پس از رنگ، آب‌گریز می‌شود و نگهداری آن ساده‌تر
                است. بیش از صدها رنگ چوب در صنعت رنگ‌سازی موجود است و رنگ‌های خارج از این شانزده کد هم به سفارش ساخته
                می‌شوند.
              </p>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="in-situ" aria-labelledby="in-situ-h">
          <div className="wrap">
            <SecHead n="۰۲" en="in situ" fa="اجرا" id="in-situ-h" title="روی دیوار" />
            <figure className="chart-fig reveal">
              <Asset
                src="/assets/img/spec/wood-bg.webp"
                width={1190}
                height={712}
                alt="دیوار تایل چوبی سه‌بعدی در یک فضای مسکونی با پنجرهٔ بزرگ"
              />
              <figcaption className="chart-cap">
                تایل‌های دکوراتیو چوبی، با امکان اجرای طرح و رنگ‌های مختلف روی یک دیوار
              </figcaption>
            </figure>
          </div>
        </section>

        <Cta
          n="۰۳"
          h2="نمونهٔ رنگ می‌خواهید؟"
          en="samples"
          fa="نمونه"
          text="کد رنگ را بگویید تا نمونهٔ فیزیکی چوب برای شما ارسال شود."
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