'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { NavItem } from '@/lib/types';

function decode(p: string) {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

function normalize(p: string) {
  const d = decode(p);
  return d.replace(/\/+$/, '') || '/';
}

export function HeaderBar({
  menus,
  logo,
  headerHeight,
  logoHeight,
  chrome,
}: {
  menus: { id: string; items: NavItem[] }[];
  logo: { src: string; width: number; height: number; href: string } | null;
  headerHeight?: string | null;
  logoHeight?: string | null;
  chrome?: { bg: string; color: string; fixed: boolean; logo: string } | null;
}) {
  const pathname = usePathname();
  const current = normalize(pathname || '/');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) => {
    const h = normalize(href);
    if (h === '/') return current === '/';
    return current === h || current.startsWith(h + '/');
  };

  const allItems = menus.flatMap((m) => m.items);
  // in RTL the first menu sits to the RIGHT of the logo (as on the live site)
  const rightMenu = menus[0]?.items ?? [];
  const leftMenu = menus[1]?.items ?? [];

  const NavList = ({ items }: { items: NavItem[] }) => (
    <ul className="header-nav-list">
      {items.map((item) => (
        <li className="header-nav-item" key={item.href + item.title}>
          <Link className={`header-nav-link${isCurrent(item.href) ? ' is-current' : ''}`} href={item.href}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header
        className="header"
        style={{
          ['--header-h' as string]: headerHeight || '113px',
          ['--logo-h' as string]: logoHeight || '100px',
          ['--header-bg' as string]: chrome?.bg || 'rgba(255,255,255,0.55)',
          ['--header-fg' as string]: chrome?.color || 'var(--color-content-text)',
          ['--header-pos' as string]: chrome?.fixed ? 'fixed' : 'absolute',
        }}
      >
        <div className="header-sub">
          <div className="header-cell">
            <nav className="header-nav header-nav-right" aria-label="منوی اصلی">
              <NavList items={rightMenu} />
            </nav>

            <button
              className="header-burger"
              type="button"
              aria-label="فهرست"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>

            {logo ? (
              <Link className="header-logo" href={logo.href || '/'} aria-label="MedisDesign">
                <Image
                  src={chrome?.logo || logo.src}
                  alt="مدیس دیزاین"
                  width={logo.width}
                  height={logo.height}
                  priority
                />
              </Link>
            ) : null}

            <nav className="header-nav header-nav-left" aria-label="منوی دوم">
              <NavList items={leftMenu} />
            </nav>
          </div>
        </div>
      </header>

      <div className="mobile-nav" aria-hidden={!open}>
        <button className="mobile-nav-close" type="button" aria-label="بستن" onClick={() => setOpen(false)}>
          ×
        </button>
        {allItems.map((item) => (
          <Link
            key={item.href + item.title}
            className={`mobile-nav-link${isCurrent(item.href) ? ' is-current' : ''}`}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </>
  );
}
