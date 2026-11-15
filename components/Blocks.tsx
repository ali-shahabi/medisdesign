import type { Block } from '@/lib/types';
import { toStyle, Icon, iconFromClass } from './ui';
import { Reveal } from './Reveal';
import { Comments } from './Comments';
import { RowView } from './RowView';
import { Carousel } from './Carousel';
import { Counter } from './Counter';

const isExternal = (href: string) => /^https?:\/\//.test(href);

function LinkWrap({ href, children, className, style, ariaLabel }: { href?: string | null; children: React.ReactNode; className?: string; style?: React.CSSProperties; ariaLabel?: string | null }) {
  if (!href) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <a
      className={className}
      style={style}
      href={href}
      aria-label={ariaLabel || undefined}
      {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

export function BlockView({ block }: { block: Block }) {
  const style = toStyle((block as { style?: Record<string, string | number> }).style);

  switch (block.type) {
    case 'text': {
      const Tag = block.tag;
      const inner = <span dangerouslySetInnerHTML={{ __html: block.html || '' }} />;
      const iconName = iconFromClass(block.icon?.cls);
      const content = (
        <>
          {iconName ? (
            <span className="text-icon">
              <Icon name={iconName} />
            </span>
          ) : null}
          {block.href ? (
            <a className="text-value" href={block.href}>
              {inner}
            </a>
          ) : (
            <span className="text-value">{inner}</span>
          )}
        </>
      );
      return (
        <Tag className={`text${iconName ? ' has-icon' : ''}`} style={style}>
          {content}
        </Tag>
      );
    }

    case 'image': {
      const wrapperRadius = (style as Record<string, unknown> | undefined)?.borderRadius;
      const imgStyle = toStyle({
        ...(block.imgStyle || {}),
        ...(wrapperRadius ? { borderRadius: String(wrapperRadius) } : {}),
      } as Record<string, string | number>);
      const alignCls = block.align === 'left' ? 'is-left' : block.align === 'right' ? 'is-right' : block.align === 'center' ? 'is-center' : '';
      return (
        <div className={`image ${alignCls}`.trim()} style={style}>
          <LinkWrap href={block.href} className="image-h" ariaLabel={block.ariaLabel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.alt} width={block.width} height={block.height} style={imgStyle} loading="lazy" decoding="async" />
          </LinkWrap>
        </div>
      );
    }

    case 'banner': {
      // the source uses ratio_2x1 / ratio_3x2 / ratio_1x1 … on each banner
      const ratio = block.ratio?.replace('ratio_', '').replace('x', ' / ');
      return (
        <LinkWrap
          href={block.href || null}
          className="banner"
          style={{ ...style, ...(ratio ? { ['--banner-ratio' as string]: ratio } : {}) }}
        >
          {block.image ? <span className="banner-image" style={{ backgroundImage: `url(${block.image})` }} /> : null}
          <span className="banner-content" style={toStyle(block.contentStyle)}>
            <span className="banner-title" style={toStyle(block.titleStyle)} dangerouslySetInnerHTML={{ __html: block.title || '' }} />
            {block.desc ? <span className="banner-desc" style={toStyle(block.descStyle)} dangerouslySetInnerHTML={{ __html: block.desc || '' }} /> : null}
          </span>
        </LinkWrap>
      );
    }

    case 'button': {
      return (
        <div style={{ textAlign: (block as { align?: string | null }).align === 'center' ? 'center' : undefined }}>
          <a
            className="btn"
            style={style}
            href={block.href || '#'}
            {...(block.target ? { target: block.target, rel: 'noopener noreferrer' } : {})}
          >
            {block.label}
          </a>
        </div>
      );
    }

    case 'separator': {
      const cls = [
        'sep',
        `size-${block.size}`,
        block.withLine ? 'with-line' : '',
        block.thick === 'thick_2' ? 'thick-2' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return (
        <div className={cls} style={style} aria-hidden="true">
          {block.withLine ? <span className="sep-line" /> : null}
        </div>
      );
    }

    case 'counter': {
      return (
        <Counter
          parts={block.parts}
          title={block.title}
          titleTag={block.titleTag}
          style={style}
          valueStyle={toStyle(block.valueStyle)}
        />
      );
    }

    case 'grid': {
      return (
        <div
          className="post-grid"
          style={{
            ...style,
            ['--grid-cols' as string]: String(block.cols || 1),
            ...(block.gap ? { ['--grid-gap' as string]: block.gap } : {}),
          }}
        >
          {block.items.map((item, i) => (
            <div className="post-card" key={item.id ?? i}>
              {item.image && item.href ? (
                <a className="post-card-image" href={item.href} aria-label={item.title || undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.imageAlt || item.title || ''} loading="lazy" decoding="async" />
                </a>
              ) : null}
              {item.title && item.href ? (
                <a className="post-card-title" href={item.href}>
                  {item.title}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      );
    }

    case 'slider': {
      return (
        <div className="slider" style={style}>
          {block.items.map((it, i) => (
            <a className="slider-item" href={it.href} key={i}>
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.title} />
              ) : null}
            </a>
          ))}
        </div>
      );
    }

    case 'wrapper': {
      const isH = block.kind === 'h';
      return (
        <div
          className={`wrapper ${isH ? 'wrapper-h' : 'wrapper-v'}`}
          style={{
            ...style,
            ...(block.align ? { textAlign: block.align as React.CSSProperties['textAlign'] } : {}),
            ...(block.valign ? { justifyContent: block.valign === 'middle' ? 'center' : block.valign === 'bottom' ? 'flex-end' : 'flex-start' } : {}),
          }}
        >
          {block.blocks.map((b, i) => (
            <BlockView block={b} key={i} />
          ))}
        </div>
      );
    }

    case 'row': {
      return <RowView row={block.row} />;
    }

    case 'carousel': {
      return <Carousel items={block.items} gutter={block.gutter} />;
    }

    case 'richtext': {
      return <div className="richtext" style={style} dangerouslySetInnerHTML={{ __html: block.html || '' }} />;
    }

    case 'comments': {
      return <Comments />;
    }

    case 'html':
    default: {
      return <div className="html-block" style={style} dangerouslySetInnerHTML={{ __html: (block as { html: string }).html || '' }} />;
    }
  }
}

export function ColumnView({ column, children }: { column: { style: Record<string, string | number>; innerStyle: Record<string, string | number>; stretched: boolean; hasScrollEffects: boolean; blocks: Block[] }; children?: never }) {
  const content = column.blocks.map((b, i) => <BlockView block={b} key={i} />);
  return (
    <div className={`col${column.stretched ? ' is-stretched' : ''}`} style={toStyle(column.style)}>
      <div className="col-inner" style={toStyle(column.innerStyle)}>
        {column.hasScrollEffects ? <Reveal>{content}</Reveal> : content}
      </div>
    </div>
  );
}
