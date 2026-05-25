import { ReactNode } from 'react';
import { BodyStrong } from '@/shared/ui';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon ? (
        <div className="mb-4 text-neutral-300">{icon}</div>
      ) : (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
          <span className="h-2 w-2 rounded-full bg-neutral-400" />
        </div>
      )}
      <BodyStrong as="p">{title}</BodyStrong>
      {description && <p className="muted mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
