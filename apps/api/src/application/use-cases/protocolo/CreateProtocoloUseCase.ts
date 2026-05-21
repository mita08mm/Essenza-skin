import { ProtocoloRepository } from '../../../infrastructure/repositories/ProtocoloRepository';

interface CreateItemProtocoloDTO {
  productoId: string;
  nombre: string;
  cantidad: number;
  aplicacion: string;
  frecuencia: string;
  duracion?: string;
  precio?: number;
  estado?: 'INDICADO' | 'ADQUIRIDO' | 'EN_USO' | 'COMPLETADO';
}

interface CreateProtocoloDTO {
  pacienteId: string;
  tratamientoId?: string;
  usuarioId: string;
  nombre: string;
  indicaciones?: string;
  duracion?: string;
  items: CreateItemProtocoloDTO[];
}

export class CreateProtocoloUseCase {
  constructor(private protocoloRepository: ProtocoloRepository) {}

  async execute(data: CreateProtocoloDTO) {
    if (!data.items || data.items.length === 0) {
      throw new Error('El protocolo debe tener al menos un producto');
    }

    return this.protocoloRepository.create(data);
  }
}
