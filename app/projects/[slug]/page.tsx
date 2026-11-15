import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/content/site';
import { Cta } from '@/components/Cta';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { SecHead } from '@/components/Section';
import { TextLink } from '@/components/TextLink';
import { Picture } from '@/components/Picture';
import { projectImage } from '@/lib/site';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMeta({
    title: `${project.name} | پروژه‌های گروه مهندسی مدیس`,
    description: `${project.name} — ${project.type}. از آرشیو پروژه‌های گروه مهندسی مدیس.`,
    path: `/projects/${project.slug}/`,
    image: `/assets/img/project-0${project.img}.jpg`,
    imageW: project.width,
    imageH: project.height,
    imageAlt: `${project.name}، ${project.type}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <PageLd
        path={`/projects/${project.slug}/`}
        name={`${project.name} | پروژه‌های گروه مهندسی مدیس`}
        description={`${project.name} — ${project.type}. از آرشیو پروژه‌های گروه مهندسی مدیس.`}
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: 'پروژه‌ها', path: '/projects/' }, { name: project.name }]}
      />

      <main id="main">
        <PageHero
          crumb={[
            ['صفحه اصلی', '/'],
            ['پروژه‌ها', '/projects/'],
            [project.name],
          ]}
          en="project"
          fa="پروژه"
          h1={project.name}
          narrow
          tags={
            <div className="ph-tags">
              <span className="tag">{project.type}</span>
              <span className="tag">آرشیو پروژه‌ها</span>
            </div>
          }
        />

        <section className="sec tight" id="overview" aria-labelledby="overview-h">
          <div className="wrap">
            <div className="art-in">
              <div className="art-body">
                <SecHead n="۰۱" en="overview" fa="نمای پروژه" id="overview-h" title="نمای پروژه" />
                <figure className="art-hero">
                  <Picture
                    {...projectImage(project.img)}
                    width={project.width}
                    height={project.height}
                    alt={`${project.name}، ${project.type}`}
                    sizes="(max-width: 900px) 92vw, 820px"
                  />
                  <figcaption className="plate-cap">
                    <span className="latin" lang="en">
                      project plate
                    </span>
                    <span className="fa">{project.type}</span>
                  </figcaption>
                </figure>
              </div>

              <aside className="art-side">
                <dl className="kv">
                  <div>
                    <dt>نوع فضا</dt>
                    <dd>{project.type}</dd>
                  </div>
                  <div>
                    <dt>آرشیو</dt>
                    <dd className="plain">
                      <Link href="/projects/">پروژه‌های مدیس</Link>
                    </dd>
                  </div>
                  <div>
                    <dt>خدمات</dt>
                    <dd className="plain">
                      <Link href="/services/">خدمات ما</Link>
                    </dd>
                  </div>
                </dl>
                <Link className="btn mt-[26px]" href="/contact/">
                  درخواست مشاوره
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="sec alt tight" id="more" aria-labelledby="more-h">
          <div className="wrap">
            <SecHead n="۰۲" en="archive" fa="بیشتر" id="more-h" title="ادامهٔ آرشیو" />
            <div className="pager">
              <Link className="prev" href={`/projects/${prev.slug}/`}>
                <span className="lbl">پروژهٔ پیشین</span>
                <b>{prev.name}</b>
              </Link>
              <Link className="next" href={`/projects/${next.slug}/`}>
                <span className="lbl">پروژهٔ بعدی</span>
                <b>{next.name}</b>
              </Link>
            </div>
          </div>
        </section>

        <Cta n="۰۳" h2="پروژهٔ مشابهی در نظر دارید؟" en="next step" fa="شروع" />
      </main>
    </>
  );
}
