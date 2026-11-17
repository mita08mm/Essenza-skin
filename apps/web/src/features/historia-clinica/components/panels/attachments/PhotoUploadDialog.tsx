'use client';

import { useEffect, useRef, useState } from 'react';
import { CategoriaFoto } from '@/features/historia-clinica/types';
import { Modal } from '@/shared/ui';
import { CATEGORIA_FOTO_UI, MEDIA_ACCEPT, isAcceptedMedia } from './attachments.utils';

interface UploadItem {
  file: File;
  preview: string;
  progress: number;
}

interface PhotoUploadDialogProps {
  open: boolean;
  initialFiles: File[];
  initialCategoria?: CategoriaFoto;
  onClose: () => void;
  onUpload: (
    files: File[],
    categoria: CategoriaFoto,
    onProgress: (index: number, pct: number) => void,
  ) => Promise<{ failed: number[] }>;
}

export function PhotoUploadDialog({
  open,
  initialFiles,
  initialCategoria,
  onClose,
  onUpload,
}: PhotoUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [categoria, setCategoria] = useState<CategoriaFoto | null>(initialCategoria ?? null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const previewUrls = useRef<string[]>([]);

  const toItems = (files: File[]): UploadItem[] =>
    files.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.push(preview);
      return { file, preview, progress: 0 };
    });

  const revokePreviews = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = [];
  };

  useEffect(() => revokePreviews, []);

  const startUpload = async (list: UploadItem[], cat: CategoriaFoto) => {
    setItems(list);
    setUploading(true);
    const { failed } = await onUpload(
      list.map((i) => i.file),
      cat,
      (index, pct) =>
        setItems((curr) => curr.map((it, i) => (i === index ? { ...it, progress: pct } : it))),
    );
    setUploading(false);
    if (failed.length === 0) {
      setTimeout(handleClose, 700);
    } else {
      setItems((curr) => curr.map((it, i) => (failed.includes(i) ? { ...it, progress: -1 } : it)));
    }
  };

  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current || !initialCategoria || initialFiles.length === 0) return;
    autoStarted.current = true;
    void startUpload(toItems(initialFiles), initialCategoria);
  }, []);

  const handleChooseCategoria = (cat: CategoriaFoto) => {
    setCategoria(cat);
    if (initialFiles.length > 0) {
      startUpload(toItems(initialFiles), cat);
    } else {
      inputRef.current?.click();
    }
  };

  const handleRetry = () => {
    if (!categoria) return;
    const fallidas = items.filter((i) => i.progress === -1).map((i) => ({ ...i, progress: 0 }));
    startUpload(fallidas, categoria);
  };

  function handleClose() {
    if (uploading) return;
    setCategoria(null);
    setItems([]);
    revokePreviews();
    onClose();
  }

  const done = items.length > 0 && !uploading && items.every((i) => i.progress === 100);
  const hasErrors = !uploading && items.some((i) => i.progress === -1);
  const totalPct = items.length
    ? Math.round(items.reduce((acc, i) => acc + Math.max(0, i.progress), 0) / items.length)
    : 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title={items.length === 0 ? '¿Antes o Después?' : 'Subiendo archivos'}
      description={
        items.length === 0
          ? initialFiles.length > 0
            ? `${initialFiles.length} archivo(s) listo(s) para subir`
            : 'Elige la categoría y luego selecciona fotos o videos (JPG, PNG, MP4)'
          : categoria
            ? `Categoría: ${CATEGORIA_FOTO_UI[categoria].label}`
            : undefined
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept={MEDIA_ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).filter(isAcceptedMedia);
          e.target.value = '';
          if (files.length > 0 && categoria) startUpload(toItems(files), categoria);
        }}
      />

      {items.length === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {(['antes', 'despues'] as const).map((cat) => {
            const ui = CATEGORIA_FOTO_UI[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleChooseCategoria(cat)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-4 py-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${ui.choiceClass}`}
              >
                <span className="font-heading text-xl font-semibold">{ui.label}</span>
                <span className="text-xs opacity-80">{ui.hint}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-neutral-600">
              <span>
                {done
                  ? '¡Listo! Archivos subidos'
                  : hasErrors
                    ? 'Algunos archivos no se pudieron subir'
                    : `Subiendo ${items.length} archivo(s)…`}
              </span>
              <span className="tabular-nums">{totalPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-2 rounded-full bg-[#7A4E24] transition-all"
                style={{ width: `${totalPct}%` }}
              />
            </div>
          </div>

          <div className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
            {items.map((item, i) => (
              <div
                key={`${item.file.name}-${i}`}
                className="border-sand-soft relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {item.file.type.startsWith('video/') ? (
                  <video
                    src={item.preview}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-x-1.5 bottom-1.5 h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full transition-all ${item.progress === -1 ? 'bg-danger w-full' : 'bg-[#7A4E24]'}`}
                    style={item.progress === -1 ? undefined : { width: `${item.progress}%` }}
                  />
                </div>
                {item.progress === -1 && (
                  <span className="bg-danger absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Error
                  </span>
                )}
                {item.progress === 100 && (
                  <span className="bg-success absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          {hasErrors && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-[#7A4E24] px-3 py-2 text-sm font-medium text-white hover:bg-[#65401D]"
              >
                Reintentar fallidas
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
