import Link from 'next/link';
import { calcularEdad } from '@/features/pacientes';
import { HistoriaClinica } from '@/features/historia-clinica/types';
import { LinkButton } from '@/shared/ui';

interface HistoriaHeaderProps {
  historia: HistoriaClinica;
  pacienteId: string;
}

export function HistoriaHeader({ historia, pacienteId }: HistoriaHeaderProps) {
  const { paciente } = historia;
  const edad = calcularEdad(paciente.fechaNacimiento);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-4">
            <Link href="/pacientes" className="text-marengo hover:text-concreto transition-colors">
              ← Volver
            </Link>
            <h1 className="font-heading text-concreto text-3xl font-bold">
              {paciente.nombre} {paciente.apellido}
            </h1>
          </div>

          <div className="flex gap-6 text-sm">
            <span className="text-marengo">
              {edad} años • Doc: {paciente.documento}
            </span>

            {historia.tipoSangre && (
              <span className="rounded-lg bg-red-100 px-3 py-1 font-medium text-red-700">
                🩸 {historia.tipoSangre}
              </span>
            )}

            {historia.alergias && (
              <span className="rounded-lg bg-yellow-100 px-3 py-1 font-medium text-yellow-800">
                ⚠️ Alergias
              </span>
            )}
          </div>

          {historia.alergias && (
            <div className="mt-3 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3">
              <p className="text-sm font-semibold text-yellow-900">ALERGIAS:</p>
              <p className="text-sm text-yellow-800">{historia.alergias}</p>
            </div>
          )}
        </div>

        <LinkButton href={`/pacientes/${pacienteId}/consulta/nueva`} variant="primary" size="md">
          + Nueva Consulta
        </LinkButton>
      </div>
    </div>
  );
}
