import Image from 'next/image';
import { CategoriaFoto, Documento } from '@/features/historia-clinica/types';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, MoreVerticalIcon } from '@/shared/ui';
import {
  CATEGORIA_FOTO_UI,
  formatAttachmentDate,
  getAttachmentFileUrl,
  isVideoUrl,
} from './attachments.utils';

interface DragState {
  dragging: boolean;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

interface PhotoViewerModalProps {
  foto: Documento;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (documentoId: string) => void;
  fotos?: Documento[];
  onNavigate?: (fotoId: string) => void;
  onMoveCategoria?: (fotoId: string, categoria: CategoriaFoto) => void;
}

const initialDragState: DragState = {
  dragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
};

export function PhotoViewerModal({
  foto,
  isOpen,
  onClose,
  onDelete,
  fotos = [],
  onNavigate,
  onMoveCategoria,
}: PhotoViewerModalProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  const resetViewer = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragState(initialDragState);
  };

  const handleClose = () => {
    setShowMenu(false);
    resetViewer();
    onClose();
  };

  const index = fotos.findIndex((f) => f.id === foto.id);
  const prev = index > 0 ? fotos[index - 1] : null;
  const next = index >= 0 && index < fotos.length - 1 ? fotos[index + 1] : null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) onNavigate?.(prev.id);
      if (e.key === 'ArrowRight' && next) onNavigate?.(next.id);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, prev, next, onNavigate, onClose]);

  const clampZoom = (value: number) => Math.min(4, Math.max(1, value));

  const updateZoom = (nextZoom: number) => {
    const clamped = clampZoom(nextZoom);
    setZoom(clamped);

    if (clamped === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/82 backdrop-blur-[2px]" onClick={handleClose}>
      <div className="relative h-full w-full" onClick={(event) => event.stopPropagation()}>
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 bg-gradient-to-b from-black/55 via-black/25 to-transparent px-5 py-5 text-white">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{foto.nombre}</p>
            <p className="mt-1 text-xs text-white/80">
              {formatAttachmentDate(foto.createdAt)}
              {fotos.length > 1 && index >= 0 && ` · ${index + 1} de ${fotos.length}`}
            </p>
            {onMoveCategoria && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-white/70">
                  {foto.categoria ? 'Mover a:' : 'Sin clasificar · Mover a:'}
                </span>
                {(['antes', 'despues'] as const).map((cat) => {
                  const activa = foto.categoria === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={activa}
                      onClick={() => onMoveCategoria(foto.id, cat)}
                      className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm transition-colors ${
                        activa
                          ? CATEGORIA_FOTO_UI[cat].pillClass
                          : 'bg-white/15 text-white hover:bg-white/30'
                      }`}
                    >
                      {CATEGORIA_FOTO_UI[cat].label}
                      {activa && ' ✓'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((current) => !current)}
                className="rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                aria-label="Opciones de imagen"
              >
                <MoreVerticalIcon className="h-5 w-5" />
              </button>
              {showMenu && (
                <div className="border-sand-soft text-concreto absolute top-12 right-0 min-w-[140px] overflow-hidden rounded-xl border bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onClose();
                      onDelete(foto.id);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              aria-label="Cerrar imagen"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={`relative h-full w-full overflow-hidden ${zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in'} ${dragState.dragging ? 'cursor-grabbing' : ''}`}
          onWheel={(event) => {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.2 : 0.2;
            updateZoom(zoom + delta);
          }}
          onDoubleClick={() => {
            updateZoom(zoom > 1 ? 1 : 2);
          }}
          onMouseDown={(event) => {
            if (zoom <= 1) {
              return;
            }

            event.preventDefault();
            setDragState({
              dragging: true,
              startX: event.clientX,
              startY: event.clientY,
              originX: pan.x,
              originY: pan.y,
            });
          }}
          onMouseMove={(event) => {
            if (!dragState.dragging) {
              return;
            }

            const deltaX = event.clientX - dragState.startX;
            const deltaY = event.clientY - dragState.startY;
            setPan({
              x: dragState.originX + deltaX,
              y: dragState.originY + deltaY,
            });
          }}
          onMouseUp={() => {
            if (!dragState.dragging) {
              return;
            }

            setDragState((current) => ({ ...current, dragging: false }));
          }}
          onMouseLeave={() => {
            if (!dragState.dragging) {
              return;
            }

            setDragState((current) => ({ ...current, dragging: false }));
          }}
        >
          <div
            className="relative h-full w-full transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {isVideoUrl(foto.url) ? (
              <video
                src={getAttachmentFileUrl(foto.url)}
                controls
                autoPlay
                playsInline
                onMouseDown={(e) => e.stopPropagation()}
                className="h-full w-full object-contain"
              />
            ) : (
              <Image
                src={getAttachmentFileUrl(foto.url)}
                alt={foto.nombre}
                fill
                className="object-contain"
                unoptimized
                priority
                loading="eager"
                draggable={false}
              />
            )}
          </div>

          {prev && (
            <button
              type="button"
              onClick={() => onNavigate?.(prev.id)}
              onMouseDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:left-5"
              aria-label="Foto anterior"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}
          {next && (
            <button
              type="button"
              onClick={() => onNavigate?.(next.id)}
              onMouseDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-5"
              aria-label="Foto siguiente"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-sm">
            <button
              type="button"
              onClick={() => updateZoom(zoom - 0.2)}
              className="rounded-full bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
            >
              -
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => updateZoom(zoom + 0.2)}
              className="rounded-full bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
            >
              +
            </button>
            <button
              type="button"
              onClick={resetViewer}
              className="rounded-full bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
