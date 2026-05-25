import type { ReactNode } from 'react';
import { Overline } from './typography';

export type Align = 'left' | 'right' | 'center';

export interface Column<T> {
  key: string;
  label: ReactNode;
  align?: Align;
  render: (row: T) => ReactNode;
  /** extra cell classes */
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  /** Optional row hover/click highlight class */
  rowClassName?: (row: T) => string | undefined;
  /** Hide on small screens (use bespoke mobile cards instead) */
  desktopOnly?: boolean;
}

const alignCls: Record<Align, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function DataTable<T>({
  columns,
  rows,
  getKey,
  rowClassName,
  desktopOnly,
}: DataTableProps<T>) {
  return (
    <div
      className={`${desktopOnly ? 'hidden lg:block' : ''}rounded-lg overflow-hidden border border-neutral-200 bg-white`}
    >
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-25 border-b border-neutral-200">
            {columns.map((c) => (
              <Overline
                as="th"
                key={c.key}
                className={`px-4 py-2.5 ${alignCls[c.align ?? 'left']}`}
              >
                {c.label}
              </Overline>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row) => (
            <tr
              key={getKey(row)}
              className={`hover:bg-neutral-25 group transition-colors ${rowClassName?.(row) ?? ''}`}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-4 py-3 text-sm ${alignCls[c.align ?? 'left']} ${c.cellClassName ?? ''}`}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
