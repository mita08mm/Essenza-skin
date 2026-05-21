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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif font-light text-gray-900">Clinical Attachments</h2>
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
          isDragging 
            ? 'border-amber-400 bg-amber-50' 
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        } ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      >
        <svg className="w-8 h-8 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm font-medium text-gray-600 mb-1">
          {isDragging ? 'Drop files here' : isUploading ? 'Uploading...' : 'Drop files to upload'}
        </p>
        <input
          type="file"
          multiple
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        <label 
          htmlFor="file-upload" 
          className="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
        >
          or click to browse
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {documentos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No attachments yet
          </p>
        ) : (
          documentos.slice(0, 5).map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex-shrink-0">
                {doc.tipo.includes('FOTO') ? (
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-amber-800 transition-colors">
                  {doc.nombre}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} • {formatFileSize(doc.tamaño)}
                </p>
              </div>
              <button 
                onClick={() => handleDownload(doc.id, doc.nombre)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-amber-100 rounded-full transition-all"
              >
                <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
