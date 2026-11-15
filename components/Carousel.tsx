'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Item = { image: string | null; width?: number | null; height?: number | null; alt?: string };

export function Carousel({ items, gutter = 11 }: { items: Item[]; gutter?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(6);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const first = track.querySelector<HTMLElement>('.carousel-item');
      if (!first) return;
      const itemW = first.offsetWidth + gutter;
      if (itemW <= 0) return;
      setPerView(Math.max(1, Math.round(track.clientWidth / itemW)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [gutter]);

  const maxIndex = Math.max(0, items.length - perView);

  const go = useCallback(
    (next: number) => {
      setIndex(Math.min(Math.max(next, 0), maxIndex));
    },
    [maxIndex],
  );

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const id = window.setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), 4500);
    return () => window.clearInterval(id);
  }, [paused, maxIndex]);

  return (
    <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button type="button" className="carousel-arrow carousel-prev" aria-label="قبلی" onClick={() => go(index - 1)}>
        ›
      </button>

      <div className="carousel-viewport">
        <div
          className="carousel-track"
          ref={trackRef}
          style={{
            gap: `${gutter}px`,
            transform: `translateX(${index * (100 / perView)}%)`,
          }}
        >
          {items.map((it, i) => (
            <div
              className="carousel-item"
              key={it.image ?? i}
              style={{ flex: `0 0 calc((100% - ${(perView - 1) * gutter}px) / ${perView})`, aspectRatio: '1 / 1' }}
            >
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.alt || ''} width={it.width || undefined} height={it.height || undefined} loading="lazy" decoding="async" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="carousel-arrow carousel-next" aria-label="بعدی" onClick={() => go(index + 1)}>
        ‹
      </button>

      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-selected={i === index}
            className={`carousel-dot${i === index ? ' is-active' : ''}`}
            aria-label={`اسلاید ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
