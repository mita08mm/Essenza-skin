'use client';

import { CategoriaFoto, Documento } from '@/features/historia-clinica/types';
import { PlusIcon } from '@/shared/ui';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PanelFrame, {
  PanelActionButton,
} from '@/features/historia-clinica/components/panels/PanelFrame';
import { AttachmentsDocumentsTab } from '@/features/historia-clinica/components/panels/attachments/AttachmentsDocumentsTab';
import { AttachmentsPhotoTab } from '@/features/historia-clinica/components/panels/attachments/AttachmentsPhotoTab';
import { AttachmentTab } from '@/features/historia-clinica/components/panels/attachments/attachments.types';
import { useAttachments } from '@/features/historia-clinica/components/panels/attachments/useAttachments';
import { agruparFotos } from '@/features/historia-clinica/components/panels/attachments/attachments.utils';

const PhotoViewerModal = dynamic(
  () =>
    import('@/features/historia-clinica/components/panels/attachments/PhotoViewerModal').then(
      (m) => ({
        default: m.PhotoViewerModal,
      }),
    ),
  { ssr: false },
);

const PhotoUploadDialog = dynamic(
  () =>
    import('@/features/historia-clinica/components/panels/attachments/PhotoUploadDialog').then(
      (m) => ({ default: m.PhotoUploadDialog }),
    ),
  { ssr: false },
);

const BeforeAfterCompare = dynamic(
  () =>
    import('@/features/historia-clinica/components/panels/attachments/BeforeAfterCompare').then(
      (m) => ({ default: m.BeforeAfterCompare }),
    ),
  { ssr: false },
);

interface AttachmentsPanelProps {
  documentos: Documento[];
  pacienteId: string;
  onUploadSuccess?: () => void;
  pacienteNombre?: string;
  motivo?: string;
}

interface UploadDialogState {
  files: File[];
  categoria?: CategoriaFoto;
}

export default function AttachmentsPanel({
  documentos,
  pacienteId,
  onUploadSuccess,
  pacienteNombre,
  motivo,
}: AttachmentsPanelProps) {
  const [activeTab, setActiveTab] = useState<AttachmentTab>('fotos');
  const [previewFotoId, setPreviewFotoId] = useState<string | null>(null);
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
  const [openDocumentoMenuId, setOpenDocumentoMenuId] = useState<string | null>(null);
  const [uploadDialog, setUploadDialog] = useState<UploadDialogState | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const {
    documentosClinicos,
    error,
    documentoInputRef,
    fotos,
    handleDelete,
    handleInlineUpload,
    isUploading,
    moverCategoria,
    uploadFotos,
  } = useAttachments({
    pacienteId,
    initialDocumentos: documentos,
    onUploadSuccess,
  });

  const grupos = useMemo(() => agruparFotos(fotos), [fotos]);
  const fotosOrdenadas = useMemo(
    () => [...grupos.sinClasificar, ...grupos.antes, ...grupos.despues],
    [grupos],
  );

  const openUploadDialog = (files: File[] = [], categoria?: CategoriaFoto) =>
    setUploadDialog({ files, categoria });

  const subtitle = [pacienteNombre, motivo].filter(Boolean).join(' · ') || undefined;

  const previewFoto = useMemo(
    () => fotos.find((foto) => foto.id === previewFotoId) ?? null,
    [fotos, previewFotoId],
  );

  const handleClosePhotoModal = () => {
    setIsFotoModalOpen(false);
    setPreviewFotoId(null);
  };

  return (
    <PanelFrame
      title="Archivos"
      action={
        <PanelActionButton
          title={activeTab === 'fotos' ? 'Subir fotos o videos' : 'Subir documento'}
          onClick={() =>
            activeTab === 'fotos' ? openUploadDialog() : documentoInputRef.current?.click()
          }
        >
          <PlusIcon className="h-5 w-5" />
        </PanelActionButton>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="-mx-5 -mt-4 mb-5 flex border-b border-[#EEE8E1]">
        <button
          type="button"
          onClick={() => setActiveTab('fotos')}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'fotos'
              ? 'border-[#7A4E24] bg-[#F7F1EA] text-[#2A2522]'
              : 'border-transparent text-[#8C847D] hover:bg-[#FBF9F6] hover:text-[#2A2522]'
          }`}
        >
          Multimedia ({fotos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('documentos')}
          className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'documentos'
              ? 'border-[#7A4E24] bg-[#F7F1EA] text-[#2A2522]'
              : 'border-transparent text-[#8C847D] hover:bg-[#FBF9F6] hover:text-[#2A2522]'
          }`}
        >
          Documentos ({documentosClinicos.length})
        </button>
      </div>

      <div>
        <input
          ref={documentoInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleInlineUpload(e.target.files?.[0] || null, 'documentos')}
        />
      </div>

      {activeTab === 'fotos' ? (
        <AttachmentsPhotoTab
          fotos={fotos}
          isUploading={isUploading}
          onOpenPhoto={(fotoId) => {
            setPreviewFotoId(fotoId);
            setIsFotoModalOpen(true);
          }}
          onFilesDropped={(files) => openUploadDialog(files)}
          onAddToCategoria={(categoria, files) => openUploadDialog(files, categoria)}
          onMove={moverCategoria}
          onCompare={() => setIsCompareOpen(true)}
          previewFotoId={previewFotoId}
        />
      ) : (
        <AttachmentsDocumentsTab
          documentos={documentosClinicos}
          isUploading={isUploading}
          onDelete={(documentoId) => {
            setOpenDocumentoMenuId(null);
            handleDelete(documentoId);
          }}
          onToggleMenu={(documentoId) => {
            setOpenDocumentoMenuId((current) => (current === documentoId ? null : documentoId));
          }}
          onTriggerUpload={() => documentoInputRef.current?.click()}
          openMenuId={openDocumentoMenuId}
        />
      )}

      {activeTab === 'fotos' && previewFoto && (
        <PhotoViewerModal
          key={previewFoto.id}
          foto={previewFoto}
          isOpen={isFotoModalOpen}
          onClose={handleClosePhotoModal}
          onDelete={handleDelete}
          fotos={fotosOrdenadas}
          onNavigate={setPreviewFotoId}
          onMoveCategoria={(fotoId, categoria) => moverCategoria([fotoId], categoria)}
        />
      )}

      {uploadDialog && (
        <PhotoUploadDialog
          open
          initialFiles={uploadDialog.files}
          initialCategoria={uploadDialog.categoria}
          onClose={() => setUploadDialog(null)}
          onUpload={uploadFotos}
        />
      )}

      {isCompareOpen && (
        <BeforeAfterCompare
          antes={grupos.antes}
          despues={grupos.despues}
          subtitle={subtitle}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </PanelFrame>
  );
}
