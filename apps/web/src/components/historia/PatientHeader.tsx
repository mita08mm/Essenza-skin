import Link from 'next/link';
import { HistoriaClinica } from '@/types/historia';
import { calcularEdad } from '@/lib/utils/paciente';
import { useState, useEffect } from 'react';
import { apiEndpoint } from '@/lib/config';

interface PatientHeaderProps {
  historia: HistoriaClinica;
  pacienteId: string;
}

export default function PatientHeader({ historia, pacienteId }: PatientHeaderProps) {
  const paciente = historia.paciente;
  const edad = calcularEdad(paciente.fechaNacimiento);
  const [saldoPendiente, setSaldoPendiente] = useState<number>(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiEndpoint(`/pacientes/${pacienteId}/saldo`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setSaldoPendiente(data.saldo || 0);
        }
      } catch (err) {
        console.error('Error cargando saldo:', err);
      } finally {
        setLoadingSaldo(false);
      }
    };

    fetchSaldo();
  }, [pacienteId]);

  return (
    <div className="bg-gradient-to-br from-amber-50/30 via-white to-white border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-12 py-8">
        {/* Back Button */}
        <Link 
          href="/pacientes" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Patient Record
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="text-sm text-gray-500">Paciente desde {new Date(paciente.createdAt).toLocaleDateString('es-ES', { year: 'numeric' })}</p>
            
            {/* Alerta de deuda */}
            <div className="mt-3 flex flex-wrap gap-2">
              {!loadingSaldo && saldoPendiente > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs font-medium text-amber-800">
                    Saldo pendiente: Bs. {saldoPendiente.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary">
              Editar Perfil
            </button>
            <Link 
              href={`/pacientes/${pacienteId}/tratamiento/nuevo`}
              className="btn-primary"
            >
              Nueva Sesión
            </Link>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-4 gap-8 pt-4 border-t border-gray-200">
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Edad / Género</span>
            <p className="text-sm font-medium text-gray-900">{edad} años / {paciente.sexo || 'Femenino'}</p>
          </div>
          
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Objetivo Estético</span>
            <p className="text-sm font-medium text-gray-900">{paciente.objetivoEstetico || 'No especificado'}</p>
          </div>
          
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Alergias</span>
            <p className="text-sm font-medium text-rose-600">{paciente.alergias || 'Ninguna'}</p>
          </div>
          
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Embarazo/Lactancia</span>
            <p className="text-sm font-medium text-gray-900">{paciente.embarazoLactancia ? 'Sí' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
