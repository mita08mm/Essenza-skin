'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { api } from '@/shared/api';
import { CategoriaFoto, Documento } from '@/features/historia-clinica/types';
import { AttachmentUploadKind } from './attachments.types';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

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
    initialDataUpdatedAt: 0, 
    staleTime: 1000 * 60 * 5, 
    enabled: Boolean(pacienteId),
  });
  function uploadToCloudinary(file: File, onProgress?: (pct: number) => void) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const tipo = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : 'raw';

    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${tipo}/upload`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error('Error al subir a Cloudinary'));
          return;
        }
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url as string, publicId: data.public_id as string });
        } catch {
          reject(new Error('Respuesta inválida de Cloudinary'));
        }
      };
      xhr.onerror = () => reject(new Error('Error de red al subir a Cloudinary'));
      xhr.send(formData);
    });
  }

  const uploadMut = useMutation({
    mutationFn: async ({ url, publicId, kind, nombre }: {
      url: string;
      publicId: string;
      kind: AttachmentUploadKind;
      nombre: string;
    }) => {
      return api.post('/documentos', {
        pacienteId,
        url,
        publicId,
        kind: kind === 'fotos' ? 'FOTO' : 'DOCUMENTO',
        nombre,
      });
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
      const { url, publicId } = await uploadToCloudinary(file);
      await uploadMut.mutateAsync({ url, publicId, kind, nombre: file.name });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error al subir archivo');
    } finally {
      if (kind === 'fotos' && fotoInputRef.current) fotoInputRef.current.value = '';
      if (kind === 'documentos' && documentoInputRef.current) documentoInputRef.current.value = '';
    }
  };

  const [isUploadingFotos, setIsUploadingFotos] = useState(false);
  const uploadFotos = async (
    files: File[],
    categoria: CategoriaFoto,
    onProgress: (index: number, pct: number) => void,
  ): Promise<{ failed: number[] }> => {
    setError(null);
    setIsUploadingFotos(true);
    const subidas: ({ url: string; publicId: string; nombre: string } | null)[] = files.map(
      () => null,
    );
    const failed: number[] = [];
    let next = 0;

    const worker = async () => {
      while (next < files.length) {
        const i = next++;
        try {
          const res = await uploadToCloudinary(files[i], (pct) => onProgress(i, pct));
          subidas[i] = { ...res, nombre: files[i].name };
          onProgress(i, 100);
        } catch {
          failed.push(i);
          onProgress(i, -1);
        }
      }
    };

    try {
      await Promise.all(Array.from({ length: Math.min(3, files.length) }, worker));
      const archivos = subidas.filter((a): a is NonNullable<typeof a> => a !== null);
      if (archivos.length > 0) {
        await api.post('/documentos', { pacienteId, kind: 'FOTO', categoria, archivos });
        queryClient.invalidateQueries({ queryKey: documentosKey(pacienteId) });
        onUploadSuccess?.();
      }
      if (failed.length > 0) {
        setError(`No se pudieron subir ${failed.length} foto(s). Intenta nuevamente.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar las fotos');
      return { failed: files.map((_, i) => i) };
    } finally {
      setIsUploadingFotos(false);
    }
    return { failed: failed.sort((a, b) => a - b) };
  };

  const categoriaMut = useMutation({
    mutationFn: ({ ids, categoria }: { ids: string[]; categoria: CategoriaFoto | null }) =>
      api.patch('/documentos/categoria', { ids, categoria }),
    onMutate: async ({ ids, categoria }) => {
      await queryClient.cancelQueries({ queryKey: documentosKey(pacienteId) });
      const previous = queryClient.getQueryData<Documento[]>(documentosKey(pacienteId));
      queryClient.setQueryData<Documento[]>(documentosKey(pacienteId), (old) =>
        old?.map((d) => (ids.includes(d.id) ? { ...d, categoria } : d)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(documentosKey(pacienteId), context.previous);
      setError('No se pudo cambiar la categoría de la foto');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentosKey(pacienteId) });
    },
  });

  const moverCategoria = (ids: string[], categoria: CategoriaFoto | null) => {
    if (ids.length === 0) return;
    setError(null);
    categoriaMut.mutate({ ids, categoria });
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
    isUploading: uploadMut.isPending || isUploadingFotos,
    moverCategoria,
    uploadFotos,
    setError,
  };
}
