'use client';

import dynamic from 'next/dynamic';
import { Spinner, alertError, PlusIcon, Subtitle, Overline, LinkButton } from '@/shared/ui';
import { useCitas } from '../hooks/useCitas';

const CalendarioCitas = dynamic(() => import('./CalendarioCitas'), {
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <Spinner />
    </div>
  ),
});

const UpcomingToday = dynamic(() => import('./UpcomingToday'), {
  loading: () => (
    <div className="flex h-48 items-center justify-center">
      <Spinner />
    </div>
  ),
});

export function CitasListView() {
  const { citas, isLoading, error, refresh, removeCita } = useCitas();

  return (
    <div className="max-w-[1400px]">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Overline>Agenda</Overline>
          <h1 className="title-page mt-1">Citas</h1>
          <Subtitle className="mt-0.5">Gestión de turnos y agenda médica</Subtitle>
        </div>
        <LinkButton
          href="/citas/nueva"
          variant="primary"
          size="sm"
          className="h-10 gap-2 px-4 shadow-xs"
        >
          <PlusIcon className="h-4 w-4" />
          Nueva cita
        </LinkButton>
      </header>

      {error && <div className={`mb-4 ${alertError}`}>{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <aside className="order-first w-full lg:order-last lg:w-72 lg:flex-shrink-0">
            <UpcomingToday citas={citas} onCitaEliminada={removeCita} onCitaActualizada={refresh} />
          </aside>
          <div className="min-w-0 flex-1">
            <CalendarioCitas citas={citas} />
          </div>
        </div>
      )}
    </div>
  );
}
