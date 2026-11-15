/* Small helpers shared by every page. `asset()` is the only place that knows
   about the GitHub Pages sub-path, so switching to a root URL is one env var. */

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const SITE = 'https://medisdesign.com';

export function asset(path: string) {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export type Source = { src: string; w?: number };

export function srcSet(list: Source[]) {
  return list.map((s) => (s.w ? `${asset(s.src)} ${s.w}w` : asset(s.src))).join(', ');
}

const DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function fa(value: number | string) {
  return String(value).replace(/\d/g, (d) => DIGITS[Number(d)]);
}

const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function faDate(iso: string) {
  return fmt.format(new Date(iso));
}

export function isoDay(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export function absolute(path = '/') {
  return `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
}

/* project images ship as a 400w + 800w webp pair and one jpg fallback */
export function projectImage(img: number) {
  return {
    webp: [
      { src: `/assets/img/project-0${img}-400.webp`, w: 400 },
      { src: `/assets/img/project-0${img}-800.webp`, w: 800 },
    ],
    jpg: `/assets/img/project-0${img}.jpg`,
  };
}

export function serviceImage(img: number) {
  return {
    webp: [
      { src: `/assets/img/svc-${img}-480.webp`, w: 480 },
      { src: `/assets/img/svc-${img}-960.webp`, w: 960 },
    ],
    jpg: `/assets/img/svc-${img}-480.jpg`,
  };
}
