'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from './Icons';

/* mobile action bar — the CSS only shows it under 700px */
export function MobileCta() {
  const home = usePathname() === '/';

  return (
    <div className="mcta" id="mcta" aria-label="تماس سریع">
      {home ? (
        <a className="btn" href="#contact">
          شروع گفت‌وگو
        </a>
      ) : (
        <Link className="btn" href="/contact/">
          شروع گفت‌وگو
        </Link>
      )}
      <a className="mcta-tel" href="tel:+982126413369">
        <Phone />
        ۰۲۱-۲۶۴۱۳۳۶۹
      </a>
    </div>
  );
}
