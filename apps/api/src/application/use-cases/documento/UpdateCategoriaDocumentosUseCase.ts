import { CategoriaFoto } from '@clinica/database';
import { DocumentoRepository } from '../../../infrastructure/repositories/DocumentoRepository';

export class UpdateCategoriaDocumentosUseCase {
  constructor(private documentoRepository: DocumentoRepository) {}

  async execute(ids: string[], categoria: CategoriaFoto | null): Promise<number> {
    return this.documentoRepository.updateCategoria(ids, categoria);
  }
}
