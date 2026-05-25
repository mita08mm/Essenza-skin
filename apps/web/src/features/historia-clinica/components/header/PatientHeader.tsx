'use client';

import Link from 'next/link';
import { HistoriaClinica } from '@/features/historia-clinica/types';
import { calcularEdad } from '@/features/pacientes';
import { usePacienteSaldo } from '@/features/pacientes';
import { Badge } from '@/shared/ui/badge';
import { PlusIcon, ChevronLeftIcon, LinkButton } from '@/shared/ui';
interface PatientHeaderProps {
  historia: HistoriaClinica;
  pacienteId: string;
}

export default function PatientHeader({ historia, pacienteId }: PatientHeaderProps) {
  const paciente = historia.paciente;
  const edad = calcularEdad(paciente.fechaNacimiento);
  const isFemale = paciente.sexo?.toUpperCase() === 'FEMENINO';
  const { saldo, isLoading: loadingSaldo } = usePacienteSaldo(pacienteId);

  const iniciales =
    `${paciente.nombre?.[0] ?? ''}${paciente.apellido?.[0] ?? ''}`.toUpperCase() || 'P';

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-5 pb-6 lg:px-12">
        <Link
          href="/pacientes"
          className="muted hover:text-brand-morena mb-4 inline-flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          Pacientes
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="text-brand-morena font-heading flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(204,175,125,0.18)] text-lg font-medium ring-1 ring-[rgba(117,76,36,0.12)]">
              {iniciales}
            </div>
            <div className="min-w-0">
              <h1 className="title-page truncate leading-tight">
                {paciente.nombre} {paciente.apellido}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600">
                <span>{edad} años</span>
                <span className="text-neutral-300">·</span>
                <span className="capitalize">
                  {(paciente.sexo ?? 'No especificado').toLowerCase()}
                </span>
                {paciente.documento && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <span>CI {paciente.documento}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <LinkButton
            href={`/pacientes/${pacienteId}/consulta/nueva`}
            variant="primary"
            size="sm"
            className="h-10 shrink-0 gap-2 px-4"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva consulta
          </LinkButton>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-neutral-100 pt-5 sm:grid-cols-4">
          <Stat label="Objetivo estético" value={paciente.objetivoEstetico || '—'} />
          <Stat
            label="Alergias"
            value={paciente.alergias || 'Ninguna'}
            highlight={paciente.alergias ? 'danger' : undefined}
          />
          {isFemale && (
            <Stat
              label="Embarazo / Lactancia"
              value={paciente.embarazoLactancia ? 'Sí' : 'No'}
              highlight={paciente.embarazoLactancia ? 'warning' : undefined}
            />
          )}
          <Stat
            label="Saldo pendiente"
            value={loadingSaldo ? '…' : saldo > 0 ? `Bs. ${saldo.toFixed(2)}` : 'Al día'}
            highlight={!loadingSaldo && saldo > 0 ? 'warning' : undefined}
          />
        </dl>
      </div>
    </header>
  );
}

interface StatProps {
  label: string;
  value: string;
  highlight?: 'warning' | 'danger';
}

function Stat({ label, value, highlight }: StatProps) {
  return (
    <div className="min-w-0">
      <dt className="overline">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium">
        {highlight ? (
          <Badge variant={highlight} dot>
            {value}
          </Badge>
        ) : (
          <span className="text-neutral-800">{value}</span>
        )}
      </dd>
    </div>
  );
}
