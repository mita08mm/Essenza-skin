import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

interface UpdatePrescripcionInput {
  pacienteId?: string;
  nombre?: string;
  items?: Array<{
    nombre: string;
    indicaciones: string;
    cantidad?: number;
  }>;
}

/**
 * Caso de uso para actualizar una prescripción.
 * Si se envían items, reemplaza completamente los items existentes.
 */
export class UpdatePrescripcionUseCase {
  constructor(private prescripcionRepository: PrescripcionRepository) {}

  async execute(id: string, data: UpdatePrescripcionInput): Promise<void> {
    const prescripcion = await this.prescripcionRepository.findById(id);

    if (!prescripcion) {
      throw new Error('Prescripción no encontrada');
    }

    await this.prescripcionRepository.update(id, data);
  }
}
