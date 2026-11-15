import { Contour } from './Icons';

export function Eyebrow({ en, fa, className }: { en: string; fa: string; className?: string }) {
  return (
    <p className={className ? `eyebrow ${className}` : 'eyebrow'}>
      <span className="latin" lang="en">
        {en}
      </span>
      <span className="rule" aria-hidden="true" />
      <span className="fa">{fa}</span>
    </p>
  );
}

/* the section number, drawn inside the contour rings */
export function Mark({ n }: { n?: string }) {
  return (
    <div className="mark" aria-hidden="true">
      <Contour className="rings" />
      {n ? <b>{n}</b> : null}
    </div>
  );
}

/* the contour field — one shape, reused at every scale */
export function Field({ className, drift, turn }: { className: string; drift: string; turn: string }) {
  return (
    <div className={`field ${className}`} data-drift={drift} data-turn={turn} aria-hidden="true">
      <Contour />
    </div>
  );
}

type SecHeadProps = {
  n?: string;
  en: string;
  fa: string;
  title: string;
  id: string;
  note?: string;
};

export function SecHead({ n, en, fa: faLabel, title, id, note }: SecHeadProps) {
  return (
    <div className="sec-bar">
      <div className="sec-head reveal">
        <Mark n={n} />
        <div className="sec-title">
          <Eyebrow en={en} fa={faLabel} />
          <h2 id={id}>{title}</h2>
        </div>
      </div>
      {note ? <p className="sec-note reveal">{note}</p> : null}
    </div>
  );
}
