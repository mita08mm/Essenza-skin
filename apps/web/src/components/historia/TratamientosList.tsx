import { useState } from 'react';
import { Tratamiento } from '@/types/historia';
import { formatFecha } from '@/lib/utils/date';
import { MedidasGrid } from './MedidasGrid';

interface TratamientosListProps {
  tratamientos: Tratamiento[];
}

const TIPO_TRATAMIENTO_COLORES = {
  FACIAL: 'bg-pink-100 text-pink-700',
  CORPORAL: 'bg-blue-100 text-blue-700',
  CAPILAR: 'bg-purple-100 text-purple-700',
  COMBINADO: 'bg-amber-100 text-amber-700',
};

const TIPO_TRATAMIENTO_LABELS = {
  FACIAL: 'Facial',
  CORPORAL: 'Corporal',
  CAPILAR: 'Capilar',
  COMBINADO: 'Combinado',
};

export default function TratamientosList({ tratamientos }: TratamientosListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(tratamientos[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filtrar tratamientos
  const filteredTratamientos = tratamientos.filter((tratamiento) => {
    const matchSearch = searchTerm === '' || 
      tratamiento.nombreTratamiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.zonaTratada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tratamiento.objetivo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = filterTipo === '' || tratamiento.tipoTratamiento === filterTipo;

    return matchSearch && matchTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-xl font-serif font-light text-gray-900">Clinical Evolution</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {filteredTratamientos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No treatments found</p>
        </div>
      )}

      {/* Timeline de tratamientos */}
      <div className="relative">
        {/* Línea vertical de timeline */}
        <div className="absolute left-[9px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-8">
          {filteredTratamientos.map((tratamiento, index) => {
            const isExpanded = expandedId === tratamiento.id;
            const tipoColor = TIPO_TRATAMIENTO_COLORES[tratamiento.tipoTratamiento];

            return (
              <div key={tratamiento.id} className="relative">
                {/* Timeline dot */}
                <div className={`absolute left-0 w-5 h-5 rounded-full border-4 border-white z-10 ${
                  index === 0 ? 'bg-amber-600' : 'bg-gray-300'
                }`}></div>

                <div className="ml-12 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tratamiento.tipoTratamiento.replace('_', ' ')}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                            {new Date(tratamiento.fecha).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }).toUpperCase()}
                          </span>
                          {tratamiento.sesionNumero && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                              Session {tratamiento.sesionNumero}/{tratamiento.totalSesiones}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-serif font-light text-gray-900 mb-2">
                          {tratamiento.nombreTratamiento}
                        </h3>
                        
                        {tratamiento.objetivo && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {tratamiento.objetivo}
                          </p>
                        )}
                      </div>

                      <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        In-Person
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Dr. {tratamiento.usuario.nombre} {tratamiento.usuario.apellido}</span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span className="text-xs uppercase text-gray-400">{tratamiento.usuario.rol}</span>
                    </div>
                  </div>

                  {/* Contenido detallado */}
                  {tratamiento.evaluacionInicial && (
                    <div className="px-5 py-4 border-t border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {tratamiento.evaluacionInicial}
                      </p>
                      
                      {tratamiento.protocolo && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Protocol Applied</p>
                          <p className="text-sm text-gray-700">{tratamiento.protocolo}</p>
                        </div>
                      )}

                      {tratamiento.documentos && tratamiento.documentos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500">
                              Blood_Results_Aug23.pdf
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
