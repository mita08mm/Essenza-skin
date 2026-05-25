'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { api } from '@/shared/api';
import { Documento } from '@/features/historia-clinica/types';
import { AttachmentUploadKind } from './attachments.types';

interface UseAttachmentsOptions {
  pacienteId: string;
  initialDocumentos: Documento[];
  onUploadSuccess?: () => void;
}

const documentosKey = (pacienteId: string) =>
  ['historia-clinica', pacienteId, 'documentos'] as const;

export function useAttachments({
  pacienteId,
  initialDocumentos,
  onUploadSuccess,
}: UseAttachmentsOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const documentoInputRef = useRef<HTMLInputElement>(null);

  const { data: documentos = initialDocumentos } = useQuery({
    queryKey: documentosKey(pacienteId),
    queryFn: async () => {
      const data = await api.get<Documento[]>(`/pacientes/${pacienteId}/documentos`);
      return data ?? [];
    },
    initialData: initialDocumentos,
    enabled: Boolean(pacienteId),
  });

  const uploadMut = useMutation({
    mutationFn: async ({ file, kind }: { file: File; kind: AttachmentUploadKind }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pacienteId', pacienteId);
      formData.append('kind', kind === 'fotos' ? 'FOTO' : 'DOCUMENTO');
      return api.upload('/documentos/upload', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentosKey(pacienteId) });
      onUploadSuccess?.();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (documentoId: string) => api.delete(`/documentos/${documentoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentosKey(pacienteId) });
      onUploadSuccess?.();
    },
  });

  const handleInlineUpload = async (file: File | null, kind: AttachmentUploadKind) => {
    if (!file) return;
    setError(null);
    try {
      await uploadMut.mutateAsync({ file, kind });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error al subir archivo');
    } finally {
      if (kind === 'fotos' && fotoInputRef.current) fotoInputRef.current.value = '';
      if (kind === 'documentos' && documentoInputRef.current) documentoInputRef.current.value = '';
    }
  };

  const handleDelete = async (documentoId: string) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    try {
      await deleteMut.mutateAsync(documentoId);
    } catch {
      setError('Error al eliminar el archivo');
    }
  };

  const fotos = useMemo(() => documentos.filter((d) => d.kind === 'FOTO'), [documentos]);
  const documentosClinicos = useMemo(
    () => documentos.filter((d) => d.kind === 'DOCUMENTO'),
    [documentos],
  );

  return {
    documentos,
    documentosClinicos,
    error,
    fotoInputRef,
    documentoInputRef,
    fotos,
    handleDelete,
    handleInlineUpload,
    isUploading: uploadMut.isPending,
    setError,
  };
}
