import { absolute } from '@/lib/site';

export type LdCrumb = { name: string; path?: string };

/* WebPage + BreadcrumbList for one page. The Organization/WebSite graph lives
   in the root layout. */
export function PageLd({
  path,
  name,
  description,
  crumbs,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: LdCrumb[];
}) {
  const url = absolute(path);

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: 'fa-IR',
        isPartOf: { '@id': `${absolute('/')}#website` },
        about: { '@id': `${absolute('/')}#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          ...(c.path ? { item: absolute(c.path) } : {}),
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // the object above is ours; no user input reaches it
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
