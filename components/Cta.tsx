import type { ReactNode } from 'react';
import Link from 'next/link';
import { contact } from '@/content/site';
import { Arrow } from './Icons';
import { Eyebrow, Field, Mark } from './Section';

type Props = {
  /** section number shown in the rings */
  n?: string;
  h2?: string;
  en?: string;
  fa?: string;
  text?: string;
  /** extra element under the actions, e.g. a catalogue link */
  more?: ReactNode;
  /** fully replaces the right-hand column */
  side?: ReactNode;
  showActions?: boolean;
  /** full-height section (home) or the compact closing panel (interior pages) */
  tight?: boolean;
  id?: string;
  labelId?: string;
  className?: string;
};

/* The terracotta panel that closes most pages. */
export function Cta({
  n,
  h2 = 'در تماس باشید',
  en = 'dialogue',
  fa = 'تماس',
  text = 'ما در تمام مراحل پروژه کنار شما هستیم …!',
  more,
  side,
  showActions = true,
  tight = true,
  id,
  labelId,
  className = '',
}: Props) {
  const headingId = labelId ?? `cta-h-${n ?? 'x'}`;

  return (
    <section className={`sec ${tight ? 'tight' : ''} ${className}`} {...(id ? { id } : {})} aria-labelledby={headingId}>
      <div className="wrap">
        <div className="panel reveal">
          <Field className="panel-field" drift="-0.02" turn="0.003" />
          <div className="panel-in max-[900px]:block">
            <div className="c-main col-span-7">
              <div className="sec-head">
                {n ? <Mark n={n} /> : null}
                <div className="sec-title">
                  <Eyebrow en={en} fa={fa} />
                  <h2 id={headingId}>{h2}</h2>
                </div>
              </div>
              {text ? <p className="c-cta">{text}</p> : null}
              {showActions ? (
                <div className="ph-actions">
                  <Link className="btn" href="/contact/">
                    شروع گفت‌وگو
                  </Link>
                  <a className="link" href="tel:+982126413369">
                    ۰۲۱-۲۶۴۱۳۳۶۹
                    <Arrow />
                  </a>
                </div>
              ) : null}
              {more}
            </div>

            <div className="c-side col-start-9 col-span-4">
              {side ?? (
                <>
                  <div className="c-address mt-0 border-t-0 pt-0">
                    <span className="lbl">دفتر مرکزی</span>
                    <p>{contact.office}</p>
                  </div>
                  <div className="c-address">
                    <span className="lbl">کارخانه</span>
                    <p>{contact.factory}</p>
                  </div>
                  <a className="c-site" href={contact.site}>
                    {contact.siteLabel}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
