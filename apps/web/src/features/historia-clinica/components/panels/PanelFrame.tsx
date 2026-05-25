import { ReactNode } from 'react';
import { CardTitle, Caption } from '@/shared/ui';

interface PanelFrameProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export default function PanelFrame({
  title,
  description,
  action,
  children,
  contentClassName,
}: PanelFrameProps) {
  return (
    <section className="surface overflow-hidden">
      <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <CardTitle as="h2">{title}</CardTitle>
          {description && (
            <Caption as="p" className="mt-0.5">
              {description}
            </Caption>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={contentClassName ?? 'px-5 py-4'}>{children}</div>
    </section>
  );
}

interface PanelActionButtonProps {
  onClick: () => void;
  title?: string;
  children: ReactNode;
}

export function PanelActionButton({ onClick, title, children }: PanelActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="hover:text-brand-morena inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}
