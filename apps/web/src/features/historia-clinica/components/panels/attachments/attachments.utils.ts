import type { Documento } from '@/features/historia-clinica/types';
import { config } from '@/shared/config';

export const formatAttachmentDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getAttachmentFileUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const apiBaseUrl = (config.apiUrl ?? '').replace(/\/api\/?$/, '').replace(/\/$/, '');
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;

  return `${apiBaseUrl}${normalizedPath}`;
};

export const formatAttachmentSize = (size: number) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

export const PALETA = {
  cafe: '#7A4E24',
  tabActiva: '#F7F1EA',
} as const;

export const CATEGORIA_FOTO_UI = {
  antes: {
    label: 'Antes',
    hint: 'Estado inicial del paciente',
    empty: 'Aún no hay fotos de Antes',
    pillClass: 'bg-[#EFEAE4] text-[#4A433E]',
    tileClass: 'bg-[#D6CCC0]',
    choiceClass: 'border-[#D6CCC0] bg-[#EFEAE4] text-[#4A433E] hover:border-[#7A4E24]/50',
    dropClass: 'ring-[#D6CCC0] bg-[#EFEAE4]/60',
  },
  despues: {
    label: 'Después',
    hint: 'Resultado del tratamiento',
    empty: 'Aún no hay fotos de Después',
    pillClass: 'bg-[#7A4E24] text-white',
    tileClass: 'bg-[#EADFD1]',
    choiceClass: 'border-[#7A4E24] bg-[#7A4E24] text-white hover:bg-[#65401D]',
    dropClass: 'ring-[#7A4E24]/40 bg-[#EADFD1]/60',
  },
} as const;

export const PILL_BASE =
  'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]';

export const FOTO_DRAG_TYPE = 'application/x-clinica-foto-id';

export const agruparFotos = (fotos: Documento[]) => {
  const ordenadas = [...fotos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return {
    sinClasificar: ordenadas.filter((f) => !f.categoria),
    antes: ordenadas.filter((f) => f.categoria === 'antes'),
    despues: ordenadas.filter((f) => f.categoria === 'despues'),
  };
};

export const MEDIA_ACCEPT = 'image/jpeg,image/png,video/mp4,video/quicktime,video/webm';
export const isAcceptedMedia = (file: File) => MEDIA_ACCEPT.split(',').includes(file.type);

export const isVideoUrl = (url: string) =>
  url.includes('/video/upload/') || /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url);

export const formatGroupDate = (date: Date | string) =>
  new Date(date)
    .toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    .replace('.', '');

export const formatDuration = (seconds: number) => {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

export const mediaLabel = (foto: Documento, index: number) =>
  `${isVideoUrl(foto.url) ? 'Video' : 'Foto'} ${index + 1}`;
