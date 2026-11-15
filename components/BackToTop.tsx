'use client';

import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`toplink${visible ? ' is-visible' : ''}`}
      aria-label="بازگشت به بالا"
      title="بازگشت به بالا"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="currentColor" />
      </svg>
    </button>
  );
}
