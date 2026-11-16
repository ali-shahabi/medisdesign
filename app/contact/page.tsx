import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { contact, contactSteps } from '@/content/site';
import { ContactSide } from '@/components/ContactSide';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { Eyebrow, Field, Mark, SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'تماس با ما | گروه مهندسی مدیس',
  description:
    'دفتر مرکزی: تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹ — ۰۲۱-۲۶۴۱۳۳۶۹ · ۰۲۱-۲۶۷۰۹۵۷۲ · ۰۹۳۸۶۰۳۸۰۰۳',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <>
      <PageLd
        path="/contact/"
        name="تماس با ما | گروه مهندسی مدیس"
        description="دفتر مرکزی: تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'تماس با ما' }]}
      />

      <main id="main">
        <PageHero
          en="dialogue"
          fa="تماس"
          h1="تماس با ما"
          lede="ما در تمام مراحل پروژه کنار شما هستیم …! برای مشاورهٔ اولیه، تماس یا ایمیل کافی است."
        />

        <section className="sec tight" id="offices" aria-labelledby="offices-h">
          <div className="wrap">
            <div className="panel reveal">
              <Field className="panel-field" drift="-0.02" turn="0.003" />
              <div className="panel-in max-[900px]:block">
                <div className="c-main col-span-7">
                  <div className="sec-head">
                    <Mark n="۰۱" />
                    <div className="sec-title">
                      <Eyebrow en="addresses" fa="دفترها" />
                      <h2 id="offices-h">دفتر مرکزی و کارخانه</h2>
                    </div>
                  </div>
                  <div className="c-address">
                    <span className="lbl">دفتر مرکزی</span>
                    <p>{contact.office}</p>
                  </div>
                  <div className="c-address">
                    <span className="lbl">کارخانه</span>
                    <p>{contact.factory}</p>
                  </div>
                  <div className="ph-actions mt-[34px]">
                    <a className="btn" href={`mailto:${contact.email}`}>
                      ارسال ایمیل
                    </a>
                    <TextLink href="tel:+982126413369">تماس تلفنی</TextLink>
                  </div>
                </div>
                <div className="c-side col-start-9 col-span-4">
                  <ContactSide />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="how" aria-labelledby="how-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="how it starts"
              fa="شروع"
              id="how-h"
              title="گفت‌وگو چطور شروع می‌شود"
              note="سه گام ساده؛ پیش از هر قرارداد."
            />

            <div className="svc-grid">
              {contactSteps.map((step, i) => (
                <article key={step.n} className="tile reveal" style={{ '--d': `${i * 0.06}s` } as CSSProperties}>
                  <span className="tile-top">
                    <span className="n">{step.n}</span>
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
