'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* The three bits of behaviour the design needs, ported from the static build:
   the mobile bar, the quiet reveals and the contour drift. Runs again after a
   client-side navigation so the new page animates like a fresh document. */
export function SiteBehavior() {
  const pathname = usePathname();

  /* mobile action bar — hidden once the contact panel is on screen */
  useEffect(() => {
    const root = document.documentElement;
    const bar = document.getElementById('mcta');
    const contact = document.getElementById('contact');
    root.classList.add('has-mcta');

    let spy: IntersectionObserver | undefined;
    if (bar && contact && 'IntersectionObserver' in window) {
      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            bar.classList.toggle('is-off', entry.isIntersecting);
            root.classList.toggle('cta-off', entry.isIntersecting);
          });
        },
        { rootMargin: '-30% 0px 0px 0px', threshold: 0 },
      );
      spy.observe(contact);
    }

    return () => {
      spy?.disconnect();
      root.classList.remove('cta-off');
      bar?.classList.remove('is-off');
    };
  }, [pathname]);

  /* quiet reveals — plus a safety net so nothing can stay invisible */
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    let io: IntersectionObserver | undefined;

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      items.forEach((el) => io?.observe(el));
    } else {
      items.forEach((el) => el.classList.add('in'));
    }

    const timer = window.setTimeout(() => items.forEach((el) => el.classList.add('in')), 4000);

    return () => {
      io?.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  /* contour drift — a slow translate plus a fraction of a degree of rotation */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fields = Array.from(document.querySelectorAll<HTMLElement>('[data-drift]'));
    if (!fields.length) return;

    let ticking = false;

    const frame = () => {
      const y = window.scrollY || 0;
      for (const el of fields) {
        const f = Number.parseFloat(el.dataset.drift || '0') || 0;
        const r = Number.parseFloat(el.dataset.turn || '0') || 0;
        el.style.transform = `translate3d(0,${(y * f).toFixed(2)}px,0) rotate(${(y * r).toFixed(3)}deg)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(frame);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    frame();

    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return null;
}
