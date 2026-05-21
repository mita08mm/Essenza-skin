import { DocumentoRepository } from '../../../infrastructure/repositories/DocumentoRepository';
import * as fs from 'fs';
import * as path from 'path';

export class DeleteDocumentoUseCase {
  constructor(private documentoRepository: DocumentoRepository) {}

  async execute(id: string): Promise<void> {
    const documento = await this.documentoRepository.findById(id);
    
    if (!documento) {
      throw new Error('Documento no encontrado');
    }

    // Eliminar archivo físico del sistema de archivos
    try {
      const uploadsDir = process.env.UPLOADS_DIR || './uploads';
      const filePath = path.join(uploadsDir, path.basename(documento.url));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error al eliminar archivo físico:', error);
      // Continuar con la eliminación del registro aunque falle el archivo
    }

    // Eliminar registro de la base de datos
    await this.documentoRepository.delete(id);
  }
}
