import { ProtocoloRepository } from '../../../infrastructure/repositories/ProtocoloRepository';

export class GetProtocoloByIdUseCase {
  constructor(private protocoloRepository: ProtocoloRepository) {}

  async execute(id: string) {
    const protocolo = await this.protocoloRepository.findById(id);

    if (!protocolo) {
      throw new Error('Protocolo no encontrado');
    }

    return protocolo;
  }
}
