import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

export class GetPrescripcionByIdUseCase {
  constructor(private protocoloRepository: PrescripcionRepository) {}

  async execute(id: string) {
    const protocolo = await this.protocoloRepository.findById(id);

    if (!protocolo) {
      throw new Error('Protocolo no encontrado');
    }

    return protocolo;
  }
}
