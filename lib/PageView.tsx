import type { Metadata } from 'next';
import type { PageModel } from '@/lib/types';
import { SectionsView } from '@/components/Sections';
import { PageShell } from '@/components/PageShell';
import { HeaderBar } from '@/components/HeaderBar';
import { site } from '@/lib/data';

export function PageView({ model }: { model: PageModel }) {
  return (
    <>
      {model.header ? (
        <HeaderBar
          menus={site.nav.menus}
          logo={site.nav.logo}
          headerHeight={model.headerHeight}
          logoHeight={model.logoHeight}
          chrome={model.header}
        />
      ) : null}
      <PageShell footer={model.footer.length ? <SectionsView sections={model.footer} /> : null}>
      <main
        className="main"
        style={{
          ['--page-header-h' as string]: model.headerHeight || '0px',
          ['--sticky-h' as string]: model.stickyHeight || '0px',
        }}
      >
        <SectionsView sections={model.sections} />
        </main>
      </PageShell>
    </>
  );
}

export function metadataFor(model: PageModel): Metadata {
  const title = model.meta.title || model.title;
  const description = model.meta.description || undefined;

  return {
    title,
    description,
    alternates: { canonical: model.path === '/' ? '/' : `${model.path}/` },
    openGraph: {
      locale: 'fa_IR',
      type: 'website',
      title: title || undefined,
      url: model.path === '/' ? '/' : `${model.path}/`,
      siteName: 'MedisDesign',
      images: model.meta.ogImage ? [{ url: model.meta.ogImage }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    robots: model.meta.robots
      ? {
          index: !/noindex/.test(model.meta.robots),
          follow: !/nofollow/.test(model.meta.robots),
        }
      : undefined,
  };
}
