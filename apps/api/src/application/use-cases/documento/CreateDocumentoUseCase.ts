import { DocumentoRepository, CreateDocumentoData } from '../../../infrastructure/repositories/DocumentoRepository';

export class CreateDocumentoUseCase {
  constructor(private documentoRepository: DocumentoRepository) {}

  async execute(data: CreateDocumentoData) {
    // Validar tamaño máximo (50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (data.tamaño > MAX_SIZE) {
      throw new Error('El archivo excede el tamaño máximo permitido (50MB)');
    }

    // Validar tipos de archivo permitidos
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedMimeTypes.includes(data.mimeType)) {
      throw new Error('Tipo de archivo no permitido');
    }

    return this.documentoRepository.create(data);
  }
}
