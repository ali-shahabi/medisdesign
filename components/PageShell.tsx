'use client';

import { useEffect, useRef } from 'react';

export function PageShell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;

    const apply = () => {
      const h = footer.offsetHeight;
      const hasContent = h > 4 && footer.querySelector('.section') !== null;
      canvas.style.marginBottom = hasContent ? `${h}px` : '0px';
      document.body.classList.toggle('footer_reveal', hasContent);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(footer);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return (
    <>
      <div className="canvas" ref={canvasRef}>
        {children}
      </div>
      <footer className="footer" ref={footerRef}>
        {footer}
      </footer>
    </>
  );
}
