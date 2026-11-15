import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allContentPaths, getArchive, getPage, getPost } from '@/lib/data';
import { PageView, metadataFor } from '@/lib/PageView';
import { SectionsView } from '@/components/Sections';
import { PageShell } from '@/components/PageShell';
import { HeaderBar } from '@/components/HeaderBar';
import { site } from '@/lib/data';

// Must be a literal boolean: `output: export` requires this to be false.
// Every path is produced by generateStaticParams, so this only decides what
// happens for URLs that do not exist -> the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  const params = allContentPaths
    .filter((p) => p !== '/' && p !== '')
    .map((p) => {
      // the scraped paths are percent-encoded; Next compares params decoded,
      // so emit the decoded segments (the URLs themselves stay byte-identical)
      let decoded = p;
      try {
        decoded = decodeURIComponent(p);
      } catch {
        /* keep as-is */
      }
      return { slug: decoded.split('/').filter(Boolean) };
    })
    .filter((p) => p.slug.length > 0);

  // de-duplicate: percent-encoded and decoded spellings can collide
  const seen = new Set<string>();
  return params.filter((p) => {
    const key = p.slug.join('/');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const path = '/' + slug.join('/');
  const model = getPage(path) ?? getPost(path);
  if (!model) {
    const archive = getArchive(path);
    if (archive) return { title: archive.meta.title || archive.title };
    return {};
  }
  return metadataFor(model);
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = '/' + slug.join('/');

  const page = getPage(path);
  if (page) return <PageView model={page} />;

  const post = getPost(path);
  if (post) return <PageView model={post} />;

  const archive = getArchive(path);
  if (archive) {
    return (
      <>
        {archive.header ? (
          <HeaderBar
            menus={site.nav.menus}
            logo={site.nav.logo}
            headerHeight={archive.headerHeight}
            logoHeight={archive.logoHeight}
            chrome={archive.header}
          />
        ) : null}
        <PageShell footer={archive.footer.length ? <SectionsView sections={archive.footer} /> : null}>
          <main className="main" style={{ ['--page-header-h' as string]: archive.headerHeight || '0px' }}>
            <SectionsView sections={archive.sections} />
          </main>
        </PageShell>
      </>
    );
  }

  notFound();
}
