import type { Row } from '@/lib/types';
import { toStyle } from './ui';
import { ColumnView } from './Blocks';

export function RowView({ row }: { row: Row }) {
  return (
    <div
      className={`row${row.boxes ? ' is-boxes' : ''}`}
      data-cols={row.cols}
      style={{ ...toStyle(row.style), ...(row.template ? { ['--cols' as string]: row.template } : {}) }}
    >
      {row.columns.map((col, i) => (
        <ColumnView key={i} column={col} />
      ))}
    </div>
  );
}
