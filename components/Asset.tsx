import { asset } from '@/lib/site';

/* A plain <img> for the catalogue-derived artwork under /assets/img/spec and
   /assets/img/wood, which ships as WebP only. <Picture> expects a JPEG
   fallback pair, so these two families get their own small wrapper. */
export function Asset({
  src,
  width,
  height,
  alt,
  className,
  priority,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={asset(src)}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading={priority ? undefined : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
