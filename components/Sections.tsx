import type { Section } from '@/lib/types';
import { toStyle } from './ui';
import { RowView } from './RowView';

export function SectionView({ section }: { section: Section }) {
  const hasBg = Boolean(section.overlay || section.backgroundImage);
  return (
    <section
      className={`section${section.fullWidth ? ' is-full' : ''}${section.fullHeight ? ' is-full-height' : ''}${section.valignCenter ? ' is-valign-center' : ''}${hasBg ? ' has-bg' : ''}`}
      style={toStyle(section.style)}
    >
      {section.overlay ? <div className="section-overlay" style={toStyle(section.overlay)} /> : null}
      {section.backgroundImage ? (
        <div className="section-bg-image" style={{ backgroundImage: `url(${section.backgroundImage})` }} />
      ) : null}
      <div className="section-inner" style={toStyle(section.innerStyle)}>
        {section.rows.map((row) => (
          <RowView key={row.id} row={row} />
        ))}
        {section.rich ? <div className="richtext" dangerouslySetInnerHTML={{ __html: section.rich || '' }} /> : null}
      </div>
    </section>
  );
}

export function SectionsView({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => (
        <SectionView key={s.id} section={s} />
      ))}
    </>
  );
}
