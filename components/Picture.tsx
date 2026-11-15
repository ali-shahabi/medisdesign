import { asset, srcSet, type Source } from '@/lib/site';

type Props = {
  webp?: Source[];
  jpg: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/* A plain <picture>: webp first, jpg fallback. Next's image loader is off for
   the static export, so this keeps the exact markup the design was built on. */
export function Picture({ webp, jpg, width, height, alt, sizes, className, priority }: Props) {
  return (
    <picture>
      {webp ? <source type="image/webp" srcSet={srcSet(webp)} sizes={sizes} /> : null}
      <img
        src={asset(jpg)}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  );
}
