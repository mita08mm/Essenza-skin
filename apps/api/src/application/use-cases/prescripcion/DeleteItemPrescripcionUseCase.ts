import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

/**
 * Caso de uso para eliminar un item individual de una prescripción.
 */
export class DeleteItemPrescripcionUseCase {
  constructor(private prescripcionRepository: PrescripcionRepository) {}

  async execute(prescripcionId: string, itemId: string): Promise<void> {
    const prescripcion = await this.prescripcionRepository.findById(prescripcionId);

    if (!prescripcion) {
      throw new Error('Prescripción no encontrada');
    }

    const itemExists = prescripcion.items?.some((item) => item.id === itemId);
    if (!itemExists) {
      throw new Error('Item no encontrado en la prescripción');
    }

    await this.prescripcionRepository.deleteItem(itemId);
  }
}
