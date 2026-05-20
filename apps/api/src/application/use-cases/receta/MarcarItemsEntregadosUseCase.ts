import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

interface UpdateItemEstadoInput {
  itemId: string;
  estado: 'PRESCRITO' | 'ENTREGADO';
}

export class MarcarItemsEntregadosUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(updates: UpdateItemEstadoInput[]) {
    if (!updates || updates.length === 0) {
      throw new Error('Debe proporcionar al menos un item para actualizar');
    }

    return this.recetaRepository.updateItemEstado(updates);
  }
}
