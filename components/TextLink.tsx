import Link from 'next/link';
import type { ReactNode } from 'react';
import { Arrow } from './Icons';

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={className ? `link ${className}` : 'link'} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}

export function ExtLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(href);
  return (
    <a
      className={className ? `link ${className}` : 'link'}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      <Arrow />
    </a>
  );
}
