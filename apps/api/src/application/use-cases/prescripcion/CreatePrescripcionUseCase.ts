import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

interface CreateItemProtocoloDTO {
  nombre: string;
  indicaciones: string;
  cantidad?: number;
}

interface CreateProtocoloDTO {
  pacienteId: string;
  usuarioId: string;
  nombre: string;
  items: CreateItemProtocoloDTO[];
}

export class CreatePrescripcionUseCase {
  constructor(private protocoloRepository: PrescripcionRepository) {}

  async execute(data: CreateProtocoloDTO) {
    if (!data.items || data.items.length === 0) {
      throw new Error('La prescripcion debe tener al menos un item');
    }

    return this.protocoloRepository.create(data);
  }
}
