import type { CSSProperties } from 'react';

export function toStyle(s: Record<string, string | number> | null | undefined): CSSProperties | undefined {
  if (!s) return undefined;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(s)) {
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return Object.keys(out).length ? (out as CSSProperties) : undefined;
}

/** icon name → inline svg path (material/fa icons used by the source site) */
export const ICONS: Record<string, string> = {
  phone:
    'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  whatsapp:
    'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.03.24-3.47-.72-2.94-1.16-4.79-4.2-4.94-4.4-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.26-.29.58-.36.77-.36.19 0 .39.01.55.01.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.14.15-.29.31-.12.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.33 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.14.26.1 1.66.78 1.95.92.29.14.48.22.55.34.07.12.07.7-.17 1.38z',
  university:
    'M12 3 1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm5 12.99-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
  industry:
    'M22 10v8h-4v-4h-4v4H6V6h4v4h4V6h4v4h4zm-2 2h-2v-2h-2v2h-2V8h-2v2H8V8H6v8h2v-4h6v4h2v-4h4v-2z',
  hand: 'M13 1.5a1.5 1.5 0 0 0-1.5 1.5v7.5h-1V4.5a1.5 1.5 0 0 0-3 0v9.1l-1.2-1.9a1.6 1.6 0 0 0-2.7 1.7l3.4 5.6A6 6 0 0 0 13 22h2a6 6 0 0 0 6-6v-5.5a1.5 1.5 0 0 0-3 0V12h-1V7.5a1.5 1.5 0 0 0-3 0V12h-1V3a1.5 1.5 0 0 0-1.5-1.5z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  linux:
    'M12 2c-1.9 0-3.4 1.5-3.4 3.4 0 1 .4 2 .4 3 0 .8-.7 1.6-1.4 2.6C6.3 12.8 5 15.2 5 17.2c0 1.5.7 2.8 2 3.4 1 .5 2.4.6 3.2.2.6-.3 1.1-.3 1.8-.3s1.2 0 1.8.3c.8.4 2.2.3 3.2-.2 1.3-.6 2-1.9 2-3.4 0-2-1.3-4.4-2.6-6.2-.7-1-1.4-1.8-1.4-2.6 0-1 .4-2 .4-3C15.4 3.5 13.9 2 12 2z',
  arrowUp: 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z',
};

export function Icon({ name, size = '1em' }: { name: string; size?: string }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** map a font-awesome / material class list to one of our inline icons */
export function iconFromClass(cls?: string | null): string | null {
  if (!cls) return null;
  const c = cls.toLowerCase();
  if (c.includes('phone')) return 'phone';
  if (c.includes('whatsapp')) return 'whatsapp';
  if (c.includes('university') || c.includes('map-marker') || c.includes('location')) return 'university';
  if (c.includes('industry') || c.includes('building')) return 'industry';
  if (c.includes('hand-pointer') || c.includes('hand')) return 'hand';
  if (c.includes('heart')) return 'heart';
  if (c.includes('linux')) return 'linux';
  return null;
}
