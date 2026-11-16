import type { Metadata } from 'next';
import { projects } from '@/content/site';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { ProjectPlate } from '@/components/ProjectPlate';
import { SecHead } from '@/components/Section';
import { StatsBand } from '@/components/Sections';
import { TextLink } from '@/components/TextLink';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'پروژه‌ها | گروه مهندسی مدیس',
  description: 'آرشیو پروژه‌های گروه مهندسی مدیس؛ سالن‌های همایش، سینما، کنفرانس، مسجد و ساختمان اداری.',
  path: '/projects/',
});

const SIZES = '(max-width: 700px) 92vw, (max-width: 1180px) 46vw, 640px';

export default function ProjectsPage() {
  return (
    <>
      <PageLd
        path="/projects/"
        name="پروژه‌ها | گروه مهندسی مدیس"
        description="آرشیو پروژه‌های گروه مهندسی مدیس؛ سالن‌های همایش، سینما، کنفرانس، مسجد و ساختمان اداری."
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'پروژه‌ها' }]}
      />

      <main id="main">
        <PageHero
          en="selected works"
          fa="پروژه‌ها"
          h1="پروژه‌های ما"
          lede="۴۲ پروژه تکمیل شده؛ سالن، سینما، مسجد، ساختمان اداری و فضای فرهنگی. هشت نمونه از آرشیو، با تصویر و نوع فضا."
          actions={<TextLink href="/contact/">گفت‌وگو دربارهٔ پروژه</TextLink>}
        />

        <section className="sec tight" id="archive" aria-labelledby="archive-h">
          <div className="wrap">
            <SecHead
              n="۰۱"
              en="archive"
              fa="آرشیو"
              id="archive-h"
              title="نمونه‌های اجرا شده"
              note="هر پروژه با نام و نوع فضا؛ بدون سال، متراژ یا ظرفیتی که در منبع نیامده است."
            />

            <div className="plates">
              {projects.map((project, i) => (
                <ProjectPlate
                  key={project.slug}
                  project={project}
                  size={i < 2 ? 'half' : 'third'}
                  index={i}
                  latin
                  sizes={SIZES}
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

        <StatsBand n="۰۲" />

        <Cta n="۰۳" h2="پروژهٔ مشابهی در نظر دارید؟" en="next step" fa="شروع" />
      </main>
    </>
  );
}
