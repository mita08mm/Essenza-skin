import { DocumentoRepository } from '../../../infrastructure/repositories/DocumentoRepository';

export class GetDocumentosByPacienteUseCase {
  constructor(private documentoRepository: DocumentoRepository) {}

  async execute(pacienteId: string) {
    return this.documentoRepository.findByPaciente(pacienteId);
  }
}
