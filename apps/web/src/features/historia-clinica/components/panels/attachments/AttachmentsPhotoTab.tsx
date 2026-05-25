import Image from 'next/image';
import { Documento } from '@/features/historia-clinica/types';
import { UploadIcon } from '@/shared/ui';
import { getAttachmentFileUrl } from './attachments.utils';

interface AttachmentsPhotoTabProps {
  fotos: Documento[];
  isUploading: boolean;
  onOpenPhoto: (fotoId: string) => void;
  onTriggerUpload: () => void;
  previewFotoId?: string | null;
}

export function AttachmentsPhotoTab({
  fotos,
  isUploading,
  onOpenPhoto,
  onTriggerUpload,
  previewFotoId,
}: AttachmentsPhotoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {fotos.map((foto) => (
        <button
          key={foto.id}
          type="button"
          onClick={() => onOpenPhoto(foto.id)}
          className={`group bg-surface-muted relative overflow-hidden rounded-2xl border text-left shadow-sm transition-all duration-200 ease-out outline-none hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:outline-none ${previewFotoId === foto.id ? 'border-morena ring-morena/20 ring-1' : 'border-sand-soft hover:border-morena/40'}`}
        >
          <div className="relative aspect-[4/5] bg-white">
            <Image
              src={getAttachmentFileUrl(foto.url)}
              alt={foto.nombre}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-3 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <span className="max-w-[70%] truncate text-xs font-medium text-white drop-shadow-sm">
                {foto.nombre}
              </span>
              <span className="rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                Ver
              </span>
            </div>
          </div>
        </button>
      ))}

      <button
        type="button"
        disabled={isUploading}
        onClick={onTriggerUpload}
        className="border-sand bg-surface-muted flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-3 py-3 text-center transition-colors hover:bg-[#f8f4ef] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="bg-piel-soft text-morena flex h-12 w-12 items-center justify-center rounded-full">
          <UploadIcon className="h-6 w-6" />
        </span>
        <span className="text-concreto mt-3 text-sm font-medium">
          {isUploading ? 'Subiendo...' : 'Subir imagen'}
        </span>
        <span className="text-marengo mt-1 text-xs">JPG, PNG</span>
      </button>
    </div>
  );
}
