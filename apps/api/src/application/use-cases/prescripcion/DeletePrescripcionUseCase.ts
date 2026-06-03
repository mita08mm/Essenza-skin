import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

/**
 * Caso de uso para eliminar una prescripción de forma permanente.
 * Elimina en cascada los items asociados según configuración de Prisma schema.
 */
export class DeletePrescripcionUseCase {
  constructor(private prescripcionRepository: PrescripcionRepository) {}

  async execute(id: string): Promise<void> {
    const prescripcion = await this.prescripcionRepository.findById(id);

    if (!prescripcion) {
      throw new Error('Prescripción no encontrada');
    }

    // Hard delete - elimina en cascada los items por configuración de Prisma schema
    await this.prescripcionRepository.delete(id);
  }
}
