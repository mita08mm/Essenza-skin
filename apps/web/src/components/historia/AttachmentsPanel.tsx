'use client';

import { Documento } from '@/types/historia';
import { useState, useCallback } from 'react';
import { apiEndpoint } from '@/lib/config';

interface AttachmentsPanelProps {
  documentos: Documento[];
  pacienteId: string;
  onUploadSuccess?: () => void;
}

export default function AttachmentsPanel({ 
  documentos, 
  pacienteId,
  onUploadSuccess 
}: AttachmentsPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fotos' | 'documentos'>('fotos');

  // Categorización al subir
  const [categoria, setCategoria] = useState<'FOTO_EVOLUCION' | 'DOCUMENTO_CLINICO'>('FOTO_EVOLUCION');
  const [momento, setMomento] = useState<'ANTES' | 'DURANTE' | 'DESPUES'>('ANTES');
  const [tipoFoto, setTipoFoto] = useState<'FACIAL' | 'CORPORAL' | 'CAPILAR'>('FACIAL');
  const [tipoDoc, setTipoDoc] = useState<'CONSENTIMIENTO' | 'LABORATORIO' | 'RAYOS_X' | 'OTRO'>('CONSENTIMIENTO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('pacienteId', pacienteId);
    
    if (categoria === 'FOTO_EVOLUCION') {
      formData.append('tipo', `FOTO_${tipoFoto}`);
      formData.append('momento', momento);
    } else {
      formData.append('tipo', tipoDoc === 'CONSENTIMIENTO' ? 'CONSENTIMIENTO_INFORMADO' : tipoDoc);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(apiEndpoint('/documentos/upload'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al subir archivo');
    }

    return response.json();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Seleccione un archivo');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await uploadFile();
      setShowUploadModal(false);
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentoId: string) => {
    if (!confirm('¿Eliminar este archivo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/documentos/${documentoId}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al eliminar');
      onUploadSuccess?.();
    } catch (err) {
      setError('Error al eliminar el archivo');
    }
  };

  // Filtrar documentos
  const fotosEvolucion = documentos.filter(d => 
    d.tipo === 'FOTO_FACIAL' || d.tipo === 'FOTO_CORPORAL' || d.tipo === 'FOTO_CAPILAR'
  );
  const documentosClinicos = documentos.filter(d => 
    d.tipo === 'CONSENTIMIENTO_INFORMADO' || d.tipo === 'ESTUDIO_DERMATOLOGICO' || d.tipo === 'OTRO'
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getMomentoLabel = (momento: string | null) => {
    switch(momento) {
      case 'ANTES': return 'Antes';
      case 'DURANTE': return 'Durante';
      case 'DESPUES': return 'Después';
      default: return '';
    }
  };

  const renderFotos = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {fotosEvolucion.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-sm text-gray-400">Sin fotos de evolución</p>
        </div>
      ) : (
        fotosEvolucion.map((foto) => (
          <div key={foto.id} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={foto.url} 
                alt={foto.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white font-medium">{getMomentoLabel(foto.momento)}</p>
                  <p className="text-xs text-gray-200">{formatDate(foto.createdAt)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(foto.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderDocumentos = () => (
    <div className="space-y-2">
      {documentosClinicos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">Sin documentos clínicos</p>
        </div>
      ) : (
        documentosClinicos.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
            <svg className="w-10 h-10 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{doc.nombre}</h4>
              <p className="text-xs text-gray-500">{formatDate(doc.createdAt)}</p>
            </div>
            <button
              onClick={() => handleDelete(doc.id)}
              className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-light text-gray-900">Galería de Archivos</h2>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="Subir archivo"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'fotos' 
                ? 'text-morena border-b-2 border-morena' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fotos Evolución ({fotosEvolucion.length})
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'documentos' 
                ? 'text-morena border-b-2 border-morena' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documentos Clínicos ({documentosClinicos.length})
          </button>
        </div>

        {/* Contenido según tab activo */}
        {activeTab === 'fotos' ? renderFotos() : renderDocumentos()}
      </div>

      {/* Modal de carga con selector */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Subir Archivo</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Seleccionar archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="FOTO_EVOLUCION">Foto de Evolución</option>
                  <option value="DOCUMENTO_CLINICO">Documento Clínico</option>
                </select>
              </div>

              {/* Opciones según categoría */}
              {categoria === 'FOTO_EVOLUCION' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Momento</label>
                    <select
                      value={momento}
                      onChange={(e) => setMomento(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="ANTES">Antes</option>
                      <option value="DURANTE">Durante</option>
                      <option value="DESPUES">Después</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
                    <select
                      value={tipoFoto}
                      onChange={(e) => setTipoFoto(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="FACIAL">Facial</option>
                      <option value="CORPORAL">Corporal</option>
                      <option value="CAPILAR">Capilar</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    value={tipoDoc}
                    onChange={(e) => setTipoDoc(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="CONSENTIMIENTO">Consentimiento Informado</option>
                    <option value="LABORATORIO">Resultados de Laboratorio</option>
                    <option value="RAYOS_X">Rayos X / Estudios</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                  className="btn-primary"
                >
                  {isUploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
