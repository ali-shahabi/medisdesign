'use client';

import { useEffect, useRef, useState } from 'react';

type Part = { kind: 'text' | 'number'; value: string };

export function Counter({
  parts,
  title,
  titleTag = 'h6',
  style,
  valueStyle,
}: {
  parts: Part[];
  title: string;
  titleTag?: string;
  style?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setProgress(1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || started.current) continue;
          started.current = true;
          const start = performance.now();
          const duration = 1200;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = titleTag as 'h6';

  return (
    <div className="counter" style={style} ref={ref}>
      <div className="counter-value" style={valueStyle}>
        {parts.map((p, i) => {
          if (p.kind !== 'number') return <span key={i}>{p.value}</span>;
          const target = Number(p.value.replace(/[^\d.-]/g, '')) || 0;
          const current = Math.round(target * progress);
          return <span key={i}>{current}</span>;
        })}
      </div>
      <Tag className="counter-title">{title}</Tag>
    </div>
  );
}
