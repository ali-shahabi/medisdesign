import Link from 'next/link';
import type { ReactNode } from 'react';
import { Eyebrow, Field } from './Section';

export type Crumb = [label: string, href?: string];

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="مسیر صفحه">
      {items.map(([label, href], i) => (
        <span key={`${label}-${i}`} className="contents">
          {i > 0 ? <i aria-hidden="true">/</i> : null}
          {href ? (
            <Link href={href}>{label}</Link>
          ) : (
            <span aria-current="page">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

type Props = {
  crumb: Crumb[];
  en: string;
  fa: string;
  h1: string;
  lede?: string;
  actions?: ReactNode;
  tags?: ReactNode;
  art?: ReactNode;
  narrow?: boolean;
};

export function PageHero({ crumb, en, fa: faLabel, h1, lede, actions, tags, art, narrow }: Props) {
  const copy = art
    ? narrow
      ? 'ph-copy narrow col-span-6 max-[1180px]:col-span-8 max-[900px]:col-span-1'
      : 'ph-copy col-span-8 max-[900px]:col-span-1'
    : 'ph-copy full col-span-12';

  const artCls = art
    ? narrow
      ? 'ph-art col-span-4 col-start-9 max-[900px]:col-span-1 max-[900px]:col-start-auto'
      : 'ph-art col-span-4 max-[900px]:col-span-1'
    : '';

  return (
    <section className="page-hero" id="top" aria-labelledby="page-h">
      <Field className="page-field" drift="0.04" turn="0.004" />
      <div className="wrap page-hero-in">
        <div className={copy}>
          <Crumbs items={crumb} />
          <Eyebrow en={en} fa={faLabel} className="mt-[22px]" />
          <h1 id="page-h">{h1}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
          {tags}
          {actions ? <div className="ph-actions">{actions}</div> : null}
        </div>
        {art ? <div className={artCls}>{art}</div> : null}
      </div>
    </section>
  );
}
