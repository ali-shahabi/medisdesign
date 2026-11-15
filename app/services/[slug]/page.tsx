import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, services } from '@/content/site';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { ProjectPlate } from '@/components/ProjectPlate';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { serviceImage } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.title} | گروه مهندسی مدیس`,
    description: service.full.slice(0, 150),
    path: `/services/${service.slug}/`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index < 0) notFound();
  const service = services[index];
  const picks = [projects[index % 8], projects[(index + 3) % 8], projects[(index + 5) % 8]];

  return (
    <>
      <PageLd
        path={`/services/${service.slug}/`}
        name={`${service.title} | گروه مهندسی مدیس`}
        description={service.full.slice(0, 150)}
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'خدمات ما', path: '/services/' }, { name: service.title }]}
      />

      <main id="main">
        <PageHero
          crumb={[
            ['صفحه اصلی', '/'],
            ['خدمات ما', '/services/'],
            [service.title],
          ]}
          en="practice"
          fa="خدمت"
          h1={service.title}
          lede={service.short}
          narrow
          tags={
            <div className="ph-tags">
              <span className="tag">طراحی</span>
              <span className="tag">اجرا</span>
              <span className="tag">نظارت</span>
            </div>
          }
          art={
            <figure className="frame">
              <Picture
                {...serviceImage(service.img)}
                width={480}
                height={270}
                alt={service.alt}
                sizes="(max-width: 900px) 90vw, 420px"
              />
            </figure>
          }
        />

        <section className="sec tight" id="about-service" aria-labelledby="about-service-h">
          <div className="wrap">
            <div className="art-in">
              <div className="art-body">
                <SecHead n="۰۱" en="scope" fa="این خدمت" id="about-service-h" title="این خدمت چه می‌کند" />
                <div className="prose">
                  <p>{service.full}</p>
                </div>
                <div className="ph-actions mt-[30px]">
                  <Link className="btn" href="/contact/">
                    درخواست مشاوره
                  </Link>
                  <TextLink href="/services/">همهٔ خدمات</TextLink>
                </div>
              </div>

              <aside className="art-side">
                <dl className="kv mt-0">
                  <div>
                    <dt>میدان</dt>
                    <dd>{service.title}</dd>
                  </div>
                  <div>
                    <dt>مرحله</dt>
                    <dd className="plain">تحلیل، طراحی، اجرا</dd>
                  </div>
                  <div>
                    <dt>محصولات</dt>
                    <dd className="plain">
                      <Link href="/products/">آکوستیک ـ دکوراتیو</Link>
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="from-archive" aria-labelledby="from-archive-h">
          <div className="wrap">
            <SecHead
              n="۰۲"
              en="from the archive"
              fa="آرشیو"
              id="from-archive-h"
              title="از آرشیو پروژه‌ها"
              note="نمونه‌هایی از سالن، سینما، مسجد و ساختمان اداری."
            />
            <div className="plates">
              {picks.map((project) => (
                <ProjectPlate
                  key={project.slug}
                  project={project}
                  size="third"
                  sizes="(max-width: 700px) 46vw, 300px"
                  delayStep={0}
                />
              ))}
              <div className="plate-cta reveal col-span-6 max-[700px]:col-span-2">
                <b>پروژه‌ای در ذهن دارید؟</b>
                <p>۴۲ پروژه تکمیل شده؛ اگر فضای شما در این فهرست نیست، گفت‌وگو را از همین‌جا شروع کنیم.</p>
                <TextLink href="/contact/">درخواست مشاوره</TextLink>
              </div>
            </div>
          </div>
        </section>

        <Cta n="۰۳" h2="برای این خدمت گفت‌وگو کنیم" en="next step" fa="شروع" />
      </main>
    </>
  );
}
