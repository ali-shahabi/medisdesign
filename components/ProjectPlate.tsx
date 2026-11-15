import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Project } from '@/content/site';
import { projectImage } from '@/lib/site';
import { Picture } from './Picture';

type Props = {
  project: Project;
  size: 'half' | 'third';
  index?: number;
  /** projects index shows the latin space-type label; home and service pages don't */
  latin?: boolean;
  sizes: string;
  delayStep?: number;
};

/* One portfolio plate. Spans are Tailwind (utilities layer wins over components),
   the 12/6/2-column grid itself lives in `.plates` in the stylesheet. */
export function ProjectPlate({ project, size, index = 0, latin = false, sizes, delayStep = 0.05 }: Props) {
  const span = size === 'half' ? 'col-span-6 max-[700px]:col-span-2' : 'col-span-3 max-[700px]:col-span-1';

  return (
    <figure
      className={`plate ${size} reveal ${span}`}
      style={{ '--d': `${(index % 4) * delayStep}s` } as CSSProperties}
    >
      <Link className="ph" href={`/projects/${project.slug}/`}>
        <Picture
          {...projectImage(project.img)}
          width={project.width}
          height={project.height}
          alt={`${project.name}، ${project.type}`}
          sizes={sizes}
        />
      </Link>
      <figcaption>
        {latin ? (
          <span className="latin" lang="en">
            {project.en}
          </span>
        ) : null}
        <h3>{project.name}</h3>
      </figcaption>
    </figure>
  );
}
