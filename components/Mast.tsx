'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { contact, nav } from '@/content/site';
import { asset } from '@/lib/site';
import { Burger, Close } from './Icons';

export function Mast() {
  const pathname = usePathname();
  const mastRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  /* mast elevation + scroll progress, written to a CSS custom property */
  useEffect(() => {
    const mast = mastRef.current;
    let last = -1;
    let frame = 0;

    const paint = () => {
      frame = 0;
      const y = window.scrollY || 0;
      mast?.classList.toggle('is-scrolled', y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (mast && Math.abs(p - last) > 0.004) {
        last = p;
        mast.style.setProperty('--p', p.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* close the sheet on navigation */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.documentElement.classList.remove('nav-open');
    setOpen(false);
  }, [pathname]);

  const openNav = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.documentElement.classList.add('nav-open');
    setOpen(true);
    dialog.querySelector<HTMLButtonElement>('.mnav-close')?.focus();
  };

  const closeNav = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.documentElement.classList.remove('nav-open');
    setOpen(false);
    burgerRef.current?.focus();
  };

  const home = pathname === '/';

  return (
    <>
      <header className="mast" ref={mastRef}>
        <div className="wrap mast-in">
          <Link className="brand" href="/" aria-label="گروه مهندسی مدیس — صفحه اصلی">
            <img src={asset('/assets/brand/medis-mark-secondary.png')} width={34} height={34} alt="نشان گروه مهندسی مدیس" />
            <span className="brand-txt">
              <b>گروه مهندسی مدیس</b>
              <span className="latin" lang="en">
                medis design group
              </span>
            </span>
          </Link>

          <nav className="nav" aria-label="ناوبری اصلی">
            {nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} {...(active ? { 'aria-current': 'page' as const } : {})}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mast-end">
            <a className="mast-tel" href="tel:+982126413369">
              ۰۲۱-۲۶۴۱۳۳۶۹
            </a>
            {home ? (
              <a className="btn small" href="#contact">
                تماس با ما
              </a>
            ) : (
              <Link className="btn small" href="/contact/">
                تماس با ما
              </Link>
            )}
            <button
              className="burger"
              type="button"
              aria-label="باز کردن منو"
              aria-haspopup="dialog"
              aria-controls="mobile-nav"
              aria-expanded={open}
              ref={burgerRef}
              onClick={openNav}
            >
              <Burger />
            </button>
          </div>
        </div>
      </header>

      <dialog className="mnav" id="mobile-nav" aria-labelledby="mnav-title" ref={dialogRef} onClose={closeNav}>
        <div className="mnav-in">
          <div className="mnav-head">
            <span className="mnav-title" id="mnav-title">
              منوی اصلی
            </span>
            <button className="mnav-close" type="button" aria-label="بستن منو" onClick={closeNav}>
              <Close />
            </button>
          </div>

          <nav aria-label="ناوبری موبایل">
            {nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} {...(active ? { 'aria-current': 'page' as const } : {})}>
                  {item.label} <span className="latin" lang="en">{item.en}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mnav-foot">
            <a className="mast-tel" href="tel:+982126413369">
              ۰۲۱-۲۶۴۱۳۳۶۹
            </a>
            <a className="mast-tel" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            {home ? (
              <a className="btn" href="#contact">
                شروع گفت‌وگو
              </a>
            ) : (
              <Link className="btn" href="/contact/">
                شروع گفت‌وگو
              </Link>
            )}
            <p className="mnav-note">{contact.office}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
