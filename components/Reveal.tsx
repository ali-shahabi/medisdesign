'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
    io.observe(el);

    // safety net: never leave content hidden (slow hydration, IO edge cases)
    const fallback = window.setTimeout(() => setShown(true), 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal${shown ? ' is-in' : ''}`}>
      {children}
    </div>
  );
}
