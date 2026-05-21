'use client';

import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';
import PatientHeader from '@/components/historia/PatientHeader';
import TratamientosList from '@/components/historia/TratamientosList';
import ProtocolosPanel from '@/components/historia/ProtocolosPanel';
import AttachmentsPanel from '@/components/historia/AttachmentsPanel';
import PagosHistory from '@/components/historia/PagosHistory';
import EmptyState from '@/components/historia/EmptyState';

function HistoriaContent() {
  const params = useParams();
  const pacienteId = params.id as string;
  
  const { historia, isLoading, error, refresh } = useHistoriaClinica(pacienteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-morena"></div>
      </div>
    );
  }

  if (error || !historia) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Historia clínica no encontrada'}</p>
      </div>
    );
  }

  const todosDocumentos = historia.tratamientos?.flatMap((t) => t.documentos || []) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader historia={historia} pacienteId={pacienteId} />

      {/* Layout Principal: 3 columnas como en Luxe Medical */}
      <div className="max-w-7xl mx-auto px-12 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Columna Principal: Timeline de Tratamientos (60%) */}
          <div className="col-span-7">
            {historia.tratamientos && historia.tratamientos.length > 0 ? (
              <TratamientosList tratamientos={historia.tratamientos} />
            ) : (
              <EmptyState pacienteId={pacienteId} />
            )}
          </div>

          {/* Columnas Derecha: Prescriptions, Attachments y Pagos (40%) */}
          <div className="col-span-5 space-y-6">
            <ProtocolosPanel 
              pacienteId={pacienteId}
            />
            <AttachmentsPanel 
              documentos={todosDocumentos} 
              pacienteId={pacienteId}
              onUploadSuccess={refresh}
            />
            <PagosHistory 
              pacienteId={pacienteId}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default function HistoriaClinicaPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <HistoriaContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
