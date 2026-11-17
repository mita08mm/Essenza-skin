'use client';

import Image from 'next/image';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { CategoriaFoto, Documento } from '@/features/historia-clinica/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/icons';
import {
  CATEGORIA_FOTO_UI,
  PILL_BASE,
  formatDuration,
  formatGroupDate,
  getAttachmentFileUrl,
  isVideoUrl,
  mediaLabel,
} from './attachments.utils';
import { PlayIcon } from './AttachmentsPhotoTab';

type Mode = 'lado' | 'deslizador';

interface BeforeAfterCompareProps {
  antes: Documento[];
  despues: Documento[];
  subtitle?: string;
  onClose: () => void;
}

export function BeforeAfterCompare({ antes, despues, subtitle, onClose }: BeforeAfterCompareProps) {
  const [mode, setMode] = useState<Mode>('lado');
  const [idxAntes, setIdxAntes] = useState(0);
  const [idxDespues, setIdxDespues] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF9F6]">
      <header className="flex flex-wrap items-center gap-3 border-b border-[#EEE8E1] bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4DDD5] text-[#2A2522] transition-colors hover:bg-[#FBF9F6]"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-xl leading-tight font-semibold text-[#2A2522]">
            Antes y después
          </h2>
          {subtitle && <p className="truncate text-xs text-[#8C847D]">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 rounded-xl bg-[#F1ECE5] p-1">
          {(
            [
              ['lado', 'Lado a lado'],
              ['deslizador', 'Deslizador'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                mode === value
                  ? 'bg-white text-[#2A2522] shadow-[0_1px_3px_rgba(60,40,20,0.12)]'
                  : 'text-[#8C847D] hover:text-[#2A2522]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {mode === 'lado' ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ComparePane categoria="antes" fotos={antes} index={idxAntes} onIndex={setIdxAntes} />
            <ComparePane
              categoria="despues"
              fotos={despues}
              index={idxDespues}
              onIndex={setIdxDespues}
            />
          </div>
        ) : (
          <SliderView
            antes={antes}
            despues={despues}
            idxAntes={idxAntes}
            idxDespues={idxDespues}
            onIdxAntes={setIdxAntes}
            onIdxDespues={setIdxDespues}
          />
        )}
      </div>
    </div>
  );
}


interface ComparePaneProps {
  categoria: CategoriaFoto;
  fotos: Documento[];
  index: number;
  onIndex: (i: number) => void;
}

function PaneHeader({ categoria, fotos, index }: Omit<ComparePaneProps, 'onIndex'>) {
  const ui = CATEGORIA_FOTO_UI[categoria];
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`${PILL_BASE} ${ui.pillClass}`}>{ui.label}</span>
      <span className="truncate text-xs text-[#8C847D]">
        {fotos[0] && `${formatGroupDate(fotos[0].createdAt)} · `}
        {fotos.length} {fotos.length === 1 ? 'archivo' : 'archivos'}
      </span>
      <span className="ml-auto text-xs font-medium text-[#2A2522] tabular-nums">
        {fotos.length ? index + 1 : 0} / {fotos.length}
      </span>
    </div>
  );
}

function ComparePane({ categoria, fotos, index, onIndex }: ComparePaneProps) {
  const ui = CATEGORIA_FOTO_UI[categoria];
  const foto = fotos[index];

  return (
    <section className="rounded-2xl border border-[#EEE8E1] bg-white p-3 shadow-[0_1px_3px_rgba(60,40,20,0.05)] sm:p-4">
      <PaneHeader categoria={categoria} fotos={fotos} index={index} />

      <div className={`relative aspect-[4/3] overflow-hidden rounded-xl ${ui.tileClass}`}>
        {foto && <MediaFull foto={foto} />}

        {fotos.length > 1 && (
          <>
            <NavButton
              side="left"
              onClick={() => onIndex((index - 1 + fotos.length) % fotos.length)}
            />
            <NavButton side="right" onClick={() => onIndex((index + 1) % fotos.length)} />
          </>
        )}

        {foto && (
          <span
            className={`pointer-events-none absolute left-3 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-[#2A2522] shadow-sm ${isVideoUrl(foto.url) ? 'top-3' : 'bottom-3'}`}
          >
            {mediaLabel(foto, index)}
          </span>
        )}
      </div>

      <ThumbStrip fotos={fotos} index={index} onIndex={onIndex} tileClass={ui.tileClass} />
    </section>
  );
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Anterior' : 'Siguiente'}
      className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2A2522] shadow-md transition-transform hover:scale-105 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ThumbStrip({
  fotos,
  index,
  onIndex,
  tileClass,
}: {
  fotos: Documento[];
  index: number;
  onIndex: (i: number) => void;
  tileClass: string;
}) {
  return (
    <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
      {fotos.map((f, i) => {
        const video = isVideoUrl(f.url);
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={mediaLabel(f, i)}
            className={`relative h-12 w-14 shrink-0 overflow-hidden rounded-lg transition-all ${tileClass} ${
              i === index ? 'ring-2 ring-[#7A4E24]' : 'opacity-80 hover:opacity-100'
            }`}
          >
            {video ? (
              <>
                <video
                  src={`${getAttachmentFileUrl(f.url)}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="pointer-events-none h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="text-concreto h-3 w-3" />
                </span>
              </>
            ) : (
              <Image
                src={getAttachmentFileUrl(f.url)}
                alt={f.nombre}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function MediaFull({ foto, cover = false }: { foto: Documento; cover?: boolean }) {
  const src = getAttachmentFileUrl(foto.url);
  const [duration, setDuration] = useState<number | null>(null);

  if (isVideoUrl(foto.url)) {
    return (
      <>
        <video
          key={src}
          src={src}
          controls
          playsInline
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          className={`h-full w-full ${cover ? 'object-cover' : 'object-contain'}`}
        />
        {duration !== null && Number.isFinite(duration) && (
          <span className="absolute top-3 right-3 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
            {formatDuration(duration)}
          </span>
        )}
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={foto.nombre}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className={cover ? 'object-cover' : 'object-contain'}
      draggable={false}
      unoptimized
      priority
    />
  );
}


interface SliderViewProps {
  antes: Documento[];
  despues: Documento[];
  idxAntes: number;
  idxDespues: number;
  onIdxAntes: (i: number) => void;
  onIdxDespues: (i: number) => void;
}

function SliderView({
  antes,
  despues,
  idxAntes,
  idxDespues,
  onIdxAntes,
  onIdxDespues,
}: SliderViewProps) {
  const [pos, setPos] = useState(50);
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const fotoAntes = antes[idxAntes];
  const fotoDespues = despues[idxDespues];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <section className="rounded-2xl border border-[#EEE8E1] bg-white p-3 shadow-[0_1px_3px_rgba(60,40,20,0.05)] sm:p-4">
        <div
          ref={areaRef}
          className="relative aspect-[4/3] touch-none overflow-hidden rounded-xl bg-[#E0D5C8] select-none"
        >
          {fotoDespues && <MediaFull foto={fotoDespues} cover />}

          {fotoAntes && (
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <MediaFull foto={fotoAntes} cover />
            </div>
          )}

          <div
            className="absolute inset-0 z-10 cursor-ew-resize"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />

          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.35)]"
            style={{ left: `${pos}%` }}
          >
            <span
              role="slider"
              tabIndex={0}
              aria-label="Deslizador antes/después"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
                if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
              }}
              className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-[#2A2522] shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#7A4E24]"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              <ChevronRightIcon className="-ml-1 h-3.5 w-3.5" />
            </span>
          </div>

          <span
            className={`pointer-events-none absolute top-3 left-3 z-20 ${PILL_BASE} ${CATEGORIA_FOTO_UI.antes.pillClass}`}
          >
            Antes
          </span>
          <span
            className={`pointer-events-none absolute top-3 right-3 z-20 ${PILL_BASE} ${CATEGORIA_FOTO_UI.despues.pillClass}`}
          >
            Después
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(
          [
            ['antes', antes, idxAntes, onIdxAntes],
            ['despues', despues, idxDespues, onIdxDespues],
          ] as const
        ).map(([cat, fotos, index, onIndex]) => (
          <section
            key={cat}
            className="rounded-2xl border border-[#EEE8E1] bg-white p-3 shadow-[0_1px_3px_rgba(60,40,20,0.05)]"
          >
            <PaneHeader categoria={cat} fotos={fotos} index={index} />
            <ThumbStrip
              fotos={fotos}
              index={index}
              onIndex={onIndex}
              tileClass={CATEGORIA_FOTO_UI[cat].tileClass}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
