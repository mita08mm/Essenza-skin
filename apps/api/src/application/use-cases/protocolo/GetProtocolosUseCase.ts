import { ProtocoloRepository } from '../../../infrastructure/repositories/ProtocoloRepository';

export class GetProtocolosUseCase {
  constructor(private protocoloRepository: ProtocoloRepository) {}

  async execute() {
    return this.protocoloRepository.findAll();
  }
}
