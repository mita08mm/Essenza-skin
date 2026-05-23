import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PanelFrameProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export default function PanelFrame({
  title,
  action,
  children,
  contentClassName,
}: PanelFrameProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-stone-100 px-3 py-2">
        <h2 className="text-sl font-heading text-concreto">{title}</h2>
        {action}
      </CardHeader>
      <CardContent className={contentClassName ?? 'px-3 py-2'}>{children}</CardContent>
    </Card>
  );
}