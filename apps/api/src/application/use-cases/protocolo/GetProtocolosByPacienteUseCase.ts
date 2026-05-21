import { ProtocoloRepository } from '../../../infrastructure/repositories/ProtocoloRepository';

export class GetProtocolosByPacienteUseCase {
  constructor(private protocoloRepository: ProtocoloRepository) {}

  async execute(pacienteId: string) {
    return this.protocoloRepository.findByPaciente(pacienteId);
  }
}
