'use client';

import { ErrorView } from '@/shared/ui';

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView {...props} />;
}
