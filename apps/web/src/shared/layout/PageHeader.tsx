import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronLeftIcon, Subtitle, Overline } from '@/shared/ui';
interface PageHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: ReactNode;
}

export function PageHeader({ overline, title, subtitle, backHref, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="mt-1.5 inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Volver"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        )}
        <div className="min-w-0">
          {overline && <Overline>{overline}</Overline>}
          <h1 className="title-page mt-1">{title}</h1>
          {subtitle && <Subtitle className="mt-0.5">{subtitle}</Subtitle>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
