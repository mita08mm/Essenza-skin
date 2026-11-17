import { DocumentoRepository, CreateDocumentoData } from '../../../infrastructure/repositories/DocumentoRepository';

export class CreateDocumentoUseCase {
  constructor(private documentoRepository: DocumentoRepository) {}

  async execute(documento: CreateDocumentoData) {
    return this.documentoRepository.create(documento);
  }

  async executeMany(documentos: CreateDocumentoData[]) {
    return this.documentoRepository.createMany(documentos);
  }
}