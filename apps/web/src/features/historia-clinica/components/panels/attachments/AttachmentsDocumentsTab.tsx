import { Documento } from '@/features/historia-clinica/types';
import { DocumentIcon, MoreVerticalIcon, UploadIcon } from '@/shared/ui';
import { formatAttachmentDate, getAttachmentFileUrl } from './attachments.utils';

interface AttachmentsDocumentsTabProps {
  documentos: Documento[];
  isUploading: boolean;
  onDelete: (documentoId: string) => void;
  onToggleMenu: (documentoId: string) => void;
  onTriggerUpload: () => void;
  openMenuId: string | null;
}

export function AttachmentsDocumentsTab({
  documentos,
  isUploading,
  onDelete,
  onToggleMenu,
  onTriggerUpload,
  openMenuId,
}: AttachmentsDocumentsTabProps) {
  return (
    <div className="space-y-3">
      {documentos.map((doc) => (
        <div
          key={doc.id}
          className="group border-sand-soft bg-surface-muted flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors hover:bg-[#f8f4ef]"
        >
          <span className="text-morena flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <DocumentIcon className="h-5 w-5" />
          </span>
          <a
            href={getAttachmentFileUrl(doc.url)}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1"
          >
            <span className="text-concreto hover:text-morena block truncate text-sm font-medium">
              {doc.nombre}
            </span>
            <p className="text-marengo mt-1 text-xs">{formatAttachmentDate(doc.createdAt)}</p>
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={() => onToggleMenu(doc.id)}
              className="text-marengo hover:text-concreto rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
              aria-label="Opciones del documento"
            >
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
            {openMenuId === doc.id && (
              <div className="border-sand-soft absolute top-12 right-0 z-10 min-w-[150px] overflow-hidden rounded-xl border bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => onDelete(doc.id)}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
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
          {isUploading ? 'Subiendo...' : 'Subir documento'}
        </span>
        <span className="text-marengo mt-1 text-xs">PDF, DOC</span>
      </button>
    </div>
  );
}
