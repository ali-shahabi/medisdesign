import type { IconName } from '@/content/site';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...stroke}>
      <path d="M13 8H4" />
      <path d="M8 4 4 8l4 4" />
    </svg>
  );
}

export function Up() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...stroke}>
      <path d="M8 13V3" />
      <path d="M3.5 7.5 8 3l4.5 4.5" />
    </svg>
  );
}

export function Phone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function Burger() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function Close() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function Doc() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 12h7" />
      <path d="M9 16h5" />
    </svg>
  );
}

const servicePaths: Record<IconName, React.ReactNode> = {
  architecture: (
    <>
      <path d="M4 20V7l8-4 8 4v13" />
      <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
    </>
  ),
  execution: (
    <>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
      <path d="M4 12c4 0 4-2.6 8-2.6s4 2.6 8 2.6" />
    </>
  ),
  industrial: (
    <>
      <path d="M3 20V9l6 3.5V9l6 3.5V6h6v14z" />
      <path d="M7 20v-3h2v3" />
    </>
  ),
  halls: (
    <>
      <path d="M3 7h18v8H3z" />
      <path d="M4 18c5 2 11 2 16 0" />
    </>
  ),
  electro: (
    <>
      <path d="M4 14.5v-5h4L13 6v12l-5-3.5H4z" />
      <path d="M16.5 9.4a3.6 3.6 0 0 1 0 5.2" />
    </>
  ),
  decorative: (
    <>
      <path d="M3 20h18" />
      <path d="M4 20V11M8 20V6M12 20v-6M16 20V8M20 20v-4" />
    </>
  ),
};

export function ServiceIcon({ name }: { name: IconName }) {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {servicePaths[name]}
    </svg>
  );
}

export function Contour({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-500 -500 1000 1000">
      <use href="#contour" x="-500" y="-500" width="1000" height="1000" />
    </svg>
  );
}
