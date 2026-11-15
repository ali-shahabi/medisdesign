import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { documents } from '@/content/site';
import { PageLd } from '@/components/PageLd';
import { PageHero } from '@/components/PageHero';
import { TextLink } from '@/components/TextLink';
import { pageMeta } from '@/lib/seo';

export function generateStaticParams() {
  return documents.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = documents.find((d) => d.slug === slug);
  if (!doc) return {};
  return pageMeta({
    title: `${doc.title} | گروه مهندسی مدیس`,
    description: doc.lead,
    path: `/${doc.slug}/`,
  });
}

export default async function DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = documents.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <PageLd
        path={`/${doc.slug}/`}
        name={`${doc.title} | گروه مهندسی مدیس`}
        description={doc.lead}
        crumbs={[{ name: 'صفحه اصلی', path: '/' }, { name: doc.title }]}
      />

      <main id="main">
        <PageHero
          crumb={[['صفحه اصلی', '/'], [doc.title]]}
          en={doc.en}
          fa="سند"
          h1={doc.title}
          narrow
        />

        <section className="sec tight" id="document" aria-labelledby="document-h">
          <div className="wrap">
            <div className="doc-panel reveal">
              <span className="latin" lang="en">
                document / {doc.slug}
              </span>
              <h2 id="document-h" className="mt-0 text-[clamp(1.3rem,1.8vw,1.6rem)]">
                {doc.title}
              </h2>
              <p>{doc.lead}</p>
              <p>متن کامل این سند در دفتر مرکزی در دسترس است؛ برای دریافت نسخهٔ چاپی یا فایل، با ما تماس بگیرید.</p>
              <div className="ph-actions">
                <Link className="btn" href="/contact/">
                  درخواست سند
                </Link>
                <TextLink href="/">بازگشت به صفحهٔ اصلی</TextLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
