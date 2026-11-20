import type { Metadata } from 'next';
import Link from 'next/link';
import { Asset } from '@/components/Asset';
import { Cta } from '@/components/Cta';
import { PageHero } from '@/components/PageHero';
import { PageLd } from '@/components/PageLd';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'صندلی همایشی و سینما | محصولات گروه مهندسی مدیس',
  description:
    'تولید صندلی همایشی و سینما با متریال و مکانیزم‌های مختلف؛ فوم سرد تزریقی، ABS، MDF با پرس ممبران و مکانیزم برگشت وزنه‌ای، با امکان ساخت سفارشی.',
  path: '/products/chairs/',
});

const parts = [
  {
    title: 'مکانیزم برگشت',
    items: [
      'مکانیزم برگشت کفی از نوع وزنهٔ تعادلی ترمزدار، با برگشت کنترل‌شده',
      'مکانیزم از نوع یاتاقان فنر و ترمز، همراه سیستم برگشت کنترل‌شونده',
    ],
  },
  {
    title: 'فوم نشیمن و پشتی',
    items: ['فوم سرد تزریقی', 'فوم گرم قالبی', 'فوم اینتگرال'],
  },
  {
    title: 'قاب و بدنه',
    items: [
      'تزریق پلاستیک PP با شاسی فلزی داخلی',
      'MDF روکش‌شده با سیستم پرس ممبران و رنگ‌بندی متنوع',
      'قالب صندلی از تزریق PP یا فوم اینتگرال مشکی',
    ],
  },
  {
    title: 'دسته و صفحهٔ تحریر',
    items: [
      'دسته از ABS به روش ترمووکیوم فرمینگ، یا MDF، یا تختهٔ چندلایی با رنگ‌آمیزی متنوع',
      'صفحهٔ تحریر از تزریق پلاستیک با رنگ‌بندی متفاوت',
      'قابلیت نصب دسته جالیوانی',
    ],
  },
  {
    title: 'شاسی و قطعات فلزی',
    items: [
      'شاسی از پروفیل و پایهٔ پرسی از ورق دو میل کششی',
      'رنگ قطعات فلزی از نوع پودری الکترواستاتیک ضدخش، با رنگ‌بندی متنوع',
    ],
  },
  {
    title: 'پارچه',
    items: [
      'انواع پارچه با رنگ و جنس مختلف',
      'قابلیت کندسوز کردن فوم و پارچه (فقط برای فوم سرد و پارچه‌های خاص)',
    ],
  },
];

const chairShots = [
  { src: '/assets/img/spec/chair-1.webp', w: 249, h: 351, alt: 'صندلی همایشی با دستهٔ چوبی و نشیمن قرمز' },
  { src: '/assets/img/spec/chair-2.webp', w: 258, h: 330, alt: 'صندلی همایشی با دستهٔ تحریر و نشیمن خاکستری' },
  { src: '/assets/img/spec/chair-3.webp', w: 273, h: 354, alt: 'صندلی همایشی با دستهٔ تحریر و نشیمن آبی' },
  { src: '/assets/img/spec/chair-4.webp', w: 285, h: 330, alt: 'صندلی همایشی با نشیمن قرمز و پایهٔ فلزی' },
];

export default function ChairsPage() {
  return (
    <>
      <PageLd
        path="/products/chairs/"
        name="صندلی همایشی و سینما | گروه مهندسی مدیس"
        description="تولید صندلی همایشی و سینما با متریال و مکانیزم‌های مختلف و امکان ساخت سفارشی."
        crumbs={[
          { name: 'صفحه اصلی', path: '/' },
          { name: 'محصولات', path: '/products/' },
          { name: 'صندلی' },
        ]}
      />

      <main id="main">
        <PageHero
          en="chairs"
          fa="صندلی"
          h1="صندلی همایشی و سینما"
          lede="تولید انواع صندلی همایشی و سینما، با امکان ساخت صندلی‌های سفارشی متناسب با سازمان‌های دولتی و خصوصی."
          actions={
            <>
              <Link className="btn" href="/contact/">
                درخواست پیش‌فاکتور
              </Link>
              <TextLink href="/products/">همهٔ محصولات</TextLink>
            </>
          }
        />

        <section className="sec tight" id="range" aria-labelledby="range-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="range"
              fa="تنوع"
              id="range-h"
              title="یک پایه، چند دسته"
              note="دسته و صفحهٔ تحریر بین مدل‌ها مشترک است؛ همین، هماهنگی ردیف را می‌سازد."
            />

            <figure className="chair-hero reveal">
              <Asset
                src="/assets/img/spec/chairs-hero.webp"
                width={1148}
                  height={788}
                alt="سالن همایش پر از صندلی‌های چوبی با نشیمن قرمز"
                priority
              />
              <figcaption className="chart-cap">
                اجرای صندلی‌های همایشی در یک سالن؛ پشتی چوبی با نشیمن پارچه‌ای
              </figcaption>
            </figure>

            <ul className="chair-row">
              {chairShots.map((shot) => (
                <li key={shot.src}>
                  <Asset src={shot.src} width={shot.w} height={shot.h} alt={shot.alt} />
                </li>
              ))}
            </ul>
            <p className="spec-note">
              چهار رنگ‌بندی از مجموعهٔ صندلی‌های همایشی؛ چیدمان، دسته و رنگ پارچه به سفارش سازمان تغییر می‌کند.
            </p>
          </div>
        </section>

        <section className="sec alt tight" id="materials" aria-labelledby="materials-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="materials"
              fa="متریال"
              id="materials-h"
              title="متریال مورد استفاده"
              note="همان جدول «Chairs Properties» کاتالوگ."
            />

            <div className="mats">
              {parts.map((p) => (
                <article key={p.title} className="mat reveal">
                  <h3>{p.title}</h3>
                  <ul>
                    {p.items.map((i) => (
                      <li key={i.slice(0, 18)}>{i}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec tight" id="quality" aria-labelledby="quality-h">
          <div className="wrap">
            <SecHead n="۰۳" en="quality" fa="کیفیت" id="quality-h" title="کیفیت ساخت، پس از نصب دیده می‌شود" />
            <div className="prose">
              <p>
                یکی از مراحلی که کیفیت ساخت صندلی در آن دیده می‌شود، بعد از اجرا و نصب آن در سالن است؛ هماهنگی بین
                صندلی‌ها گواه کیفیت ساخت بالاست. چون دستهٔ صندلی‌ها بین مدل‌ها مشترک است، اگر یک پایه درست ساخته نشده
                باشد، پس از نصب ردیف، ناتوازنی همان صندلی دیده می‌شود؛ به همین دلیل دقت در ساخت، از مراحل ابتدایی اهمیت
                دارد.
              </p>
            </div>
            <div className="ph-actions mt-[26px]">
              <TextLink href="/services/halls/">سینما و سالن‌های همایش</TextLink>
            </div>
          </div>
        </section>

        <Cta
          n="۰۴"
          h2="صندلی رویای خود را بسازید"
          en="custom"
          fa="سفارشی"
          text="تعداد، رنگ پارچه، دسته و صفحهٔ تحریر را بگویید؛ پیش‌فاکتور بر همان اساس آماده می‌شود."
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