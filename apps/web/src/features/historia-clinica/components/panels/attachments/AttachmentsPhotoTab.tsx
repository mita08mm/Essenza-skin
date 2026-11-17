import Image from 'next/image';
import { DragEvent, useMemo, useRef, useState } from 'react';
import { CategoriaFoto, Documento } from '@/features/historia-clinica/types';
import { UploadIcon } from '@/shared/ui';

const SIN_CLASIFICAR_TILE = 'bg-[#E4DDD5]';
import {
  CATEGORIA_FOTO_UI,
  FOTO_DRAG_TYPE,
  MEDIA_ACCEPT,
  PILL_BASE,
  agruparFotos,
  formatAttachmentDate,
  formatDuration,
  formatGroupDate,
  getAttachmentFileUrl,
  isAcceptedMedia,
  isVideoUrl,
} from './attachments.utils';

const MAX_VISIBLES = 6;

interface AttachmentsPhotoTabProps {
  fotos: Documento[];
  isUploading: boolean;
  onOpenPhoto: (fotoId: string) => void;
  onFilesDropped: (files: File[]) => void;
  onAddToCategoria: (categoria: CategoriaFoto, files: File[]) => void;
  onMove: (ids: string[], categoria: CategoriaFoto) => void;
  onCompare: () => void;
  previewFotoId?: string | null;
}

const isFotoDrag = (e: DragEvent) => e.dataTransfer.types.includes(FOTO_DRAG_TYPE);
const isFileDrag = (e: DragEvent) => !isFotoDrag(e) && e.dataTransfer.types.includes('Files');

export function AttachmentsPhotoTab({
  fotos,
  isUploading,
  onOpenPhoto,
  onFilesDropped,
  onAddToCategoria,
  onMove,
  onCompare,
  previewFotoId,
}: AttachmentsPhotoTabProps) {
  const { sinClasificar, antes, despues } = useMemo(() => agruparFotos(fotos), [fotos]);
  const [fileDragActive, setFileDragActive] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCategoria = useRef<CategoriaFoto>('antes');

  const pickFiles = (categoria: CategoriaFoto) => {
    pendingCategoria.current = categoria;
    inputRef.current?.click();
  };

  const fileDropHandlers = {
    onDragEnter: (e: DragEvent) => {
      if (!isFileDrag(e)) return;
      e.preventDefault();
      dragDepth.current += 1;
      setFileDragActive(true);
    },
    onDragOver: (e: DragEvent) => {
      if (isFileDrag(e)) e.preventDefault();
    },
    onDragLeave: (e: DragEvent) => {
      if (!isFileDrag(e)) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setFileDragActive(false);
    },
    onDrop: (e: DragEvent) => {
      if (!isFileDrag(e)) return;
      e.preventDefault();
      dragDepth.current = 0;
      setFileDragActive(false);
      const files = Array.from(e.dataTransfer.files).filter(isAcceptedMedia);
      if (files.length > 0) onFilesDropped(files);
    },
  };

  const canCompare = antes.length > 0 && despues.length > 0;

  return (
    <div className="relative space-y-6 sm:space-y-7" {...fileDropHandlers}>
      <input
        ref={inputRef}
        type="file"
        accept={MEDIA_ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).filter(isAcceptedMedia);
          e.target.value = '';
          if (files.length > 0) onAddToCategoria(pendingCategoria.current, files);
        }}
      />

      {fileDragActive && (
        <div className="border-morena bg-piel-soft/80 pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed backdrop-blur-[1px]">
          <UploadIcon className="text-morena h-8 w-8" />
          <span className="text-morena mt-2 text-sm font-medium">
            Suelta para subir los archivos
          </span>
        </div>
      )}

      {sinClasificar.length > 0 && (
        <>
          <section>
            <header className="mb-3 flex items-center gap-2">
              <span className={`${PILL_BASE} bg-[#F6E9D6] text-[#8A5A1F]`}>
                Sin clasificar ({sinClasificar.length})
              </span>
              <span className="min-w-0 truncate text-xs text-[#8C847D]">
                Toca Antes o Después en cada archivo
              </span>
            </header>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {sinClasificar.map((foto) => (
                <div key={foto.id}>
                  <MediaThumb
                    foto={foto}
                    tileClass={SIN_CLASIFICAR_TILE}
                    selected={previewFotoId === foto.id}
                    onOpen={onOpenPhoto}
                  />
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {(['antes', 'despues'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onMove([foto.id], cat)}
                        className={`rounded-md px-1 py-1 text-[10px] font-semibold transition-opacity hover:opacity-85 ${CATEGORIA_FOTO_UI[cat].pillClass}`}
                      >
                        {CATEGORIA_FOTO_UI[cat].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <hr className="border-[#EEE8E1]" />
        </>
      )}

      <MediaSection
        categoria="antes"
        fotos={antes}
        isUploading={isUploading}
        onAdd={() => pickFiles('antes')}
        onOpenPhoto={onOpenPhoto}
        onMove={onMove}
        previewFotoId={previewFotoId}
      />

      <hr className="border-[#EEE8E1]" />

      <MediaSection
        categoria="despues"
        fotos={despues}
        isUploading={isUploading}
        onAdd={() => pickFiles('despues')}
        onOpenPhoto={onOpenPhoto}
        onMove={onMove}
        previewFotoId={previewFotoId}
      />

      {/* Separado de las fotos: línea + aire, más amplio en pantallas grandes */}
      <div className="border-t border-[#EEE8E1] pt-5 sm:pt-6">
        <button
          type="button"
          onClick={onCompare}
          disabled={!canCompare}
          title={
            canCompare ? undefined : 'Necesitas al menos un archivo en Antes y otro en Después'
          }
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7A4E24] px-4 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#65401D] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]"
        >
          <CompareIcon className="h-4 w-4" />
          Comparar antes y después
        </button>
      </div>
    </div>
  );
}

interface MediaSectionProps {
  categoria: CategoriaFoto;
  fotos: Documento[];
  isUploading: boolean;
  onAdd: () => void;
  onOpenPhoto: (fotoId: string) => void;
  onMove: (ids: string[], categoria: CategoriaFoto) => void;
  previewFotoId?: string | null;
}

function MediaSection({
  categoria,
  fotos,
  isUploading,
  onAdd,
  onOpenPhoto,
  onMove,
  previewFotoId,
}: MediaSectionProps) {
  const ui = CATEGORIA_FOTO_UI[categoria];
  const [expanded, setExpanded] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const visibles = expanded ? fotos : fotos.slice(0, MAX_VISIBLES);
  const ocultas = fotos.length - MAX_VISIBLES;
  const fecha = fotos[0] ? formatGroupDate(fotos[0].createdAt) : null;

  return (
    <section
      onDragOver={(e) => {
        if (!isFotoDrag(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropActive(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropActive(false);
      }}
      onDrop={(e) => {
        if (!isFotoDrag(e)) return;
        e.preventDefault();
        setDropActive(false);
        const id = e.dataTransfer.getData(FOTO_DRAG_TYPE);
        if (id && !fotos.some((f) => f.id === id)) onMove([id], categoria);
      }}
      className={`-m-1.5 rounded-2xl p-1.5 ring-2 ring-transparent transition-colors ${dropActive ? ui.dropClass : ''}`}
    >
      <header className="mb-3 flex items-center gap-2">
        <span className={`${PILL_BASE} ${ui.pillClass}`}>{ui.label}</span>
        <span className="min-w-0 truncate text-xs text-[#8C847D]">
          {fotos.length} {fotos.length === 1 ? 'archivo' : 'archivos'}
          {fecha && ` · ${fecha}`}
        </span>
        <button
          type="button"
          onClick={onAdd}
          disabled={isUploading}
          className="ml-auto shrink-0 text-xs font-medium text-[#7A4E24] hover:underline disabled:opacity-50"
        >
          + Agregar
        </button>
      </header>

      {fotos.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          disabled={isUploading}
          className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#D6CCC0] px-3 py-6 text-center transition-colors hover:bg-[#F7F1EA] ${categoria === 'antes' ? 'bg-[#EFEAE4]/50' : 'bg-[#EADFD1]/40'}`}
        >
          <span className="text-concreto text-xs font-medium">{ui.empty}</span>
          <span className="text-marengo mt-1 text-[11px]">
            Toca para agregar fotos o videos, o arrástralos aquí
          </span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {visibles.map((foto) => (
              <MediaThumb
                key={foto.id}
                foto={foto}
                tileClass={ui.tileClass}
                selected={previewFotoId === foto.id}
                onOpen={onOpenPhoto}
              />
            ))}
          </div>
          {ocultas > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 w-full rounded-lg py-1.5 text-xs font-medium text-[#7A4E24] transition-colors hover:bg-[#F7F1EA]"
            >
              {expanded ? 'Ver menos' : `Ver más (${ocultas})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}

interface MediaThumbProps {
  foto: Documento;
  tileClass: string;
  selected: boolean;
  onOpen: (fotoId: string) => void;
}

export function MediaThumb({ foto, tileClass, selected, onOpen }: MediaThumbProps) {
  const src = getAttachmentFileUrl(foto.url);
  const video = isVideoUrl(foto.url);
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(FOTO_DRAG_TYPE, foto.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onOpen(foto.id)}
      title={`${foto.nombre} · ${formatAttachmentDate(foto.createdAt)}`}
      className={`group focus-visible:ring-morena/40 relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg outline-none focus-visible:ring-2 active:cursor-grabbing ${tileClass} ${selected ? 'ring-2 ring-[#7A4E24]' : ''}`}
    >
      {video ? (
        <>
          <video
            src={`${src}#t=0.1`}
            preload="metadata"
            muted
            playsInline
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            className="pointer-events-none h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform group-hover:scale-110">
              <PlayIcon className="text-concreto ml-0.5 h-3.5 w-3.5" />
            </span>
          </span>
          {duration !== null && Number.isFinite(duration) && (
            <span className="pointer-events-none absolute right-1.5 bottom-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
              {formatDuration(duration)}
            </span>
          )}
        </>
      ) : (
        <Image
          src={src}
          alt={foto.nombre}
          fill
          sizes="(max-width: 640px) 33vw, 140px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          draggable={false}
          unoptimized
        />
      )}
    </button>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.76-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function CompareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M12 4v16" />
    </svg>
  );
}
