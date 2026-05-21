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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pacienteId', pacienteId);
    formData.append('tipo', 'OTRO'); // Por defecto, se puede mejorar con un selector

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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    // Validar tamaño total
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (totalSize > maxSize) {
      setError('Los archivos exceden el tamaño máximo de 50MB');
      return;
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        await uploadFile(file);
      }
      onUploadSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivos');
    } finally {
      setIsUploading(false);
    }
  }, [pacienteId, onUploadSuccess]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const file of files) {
        await uploadFile(file);
      }
      onUploadSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (documentoId: string, nombre: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/documentos/${documentoId}/download`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al descargar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error al descargar el archivo');
    }
  };

  const handleDelete = async (documentoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/documentos/${documentoId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar');

      onUploadSuccess?.();
    } catch (err) {
      setError('Error al eliminar el archivo');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (tipo: string, mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-concreto mb-4">Documentos Adjuntos</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-4
          ${isDragging ? 'border-morena bg-morena/5' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-morena mx-auto mb-2"></div>
            <p className="text-sm text-marengo/60">Subiendo archivos...</p>
          </>
        ) : (
          <>
            <div className="text-4xl text-marengo/30 mb-2">📎</div>
            <p className="text-sm text-marengo/60 mb-1">Arrastra archivos aquí</p>
            <p className="text-xs text-marengo/40 mb-3">
              PDF, imágenes, documentos Word (máx. 50MB)
            </p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                disabled={isUploading}
              />
              <span className="px-4 py-2 bg-morena text-white text-sm rounded-lg hover:bg-morena/90 cursor-pointer">
                Seleccionar archivos
              </span>
            </label>
          </>
        )}
      </div>

      <div className="space-y-3">
        {documentos.length === 0 ? (
          <p className="text-sm text-marengo/60 text-center py-4">
            No hay documentos adjuntos
          </p>
        ) : (
          documentos.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-marengo">
                  {getFileIcon(doc.tipo, doc.mimeType)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-concreto truncate">{doc.nombre}</p>
                <p className="text-xs text-marengo/60">
                  {formatFileSize(doc.tamaño)} • {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(doc.id, doc.nombre)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Descargar"
                >
                  <svg className="w-4 h-4 text-marengo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
