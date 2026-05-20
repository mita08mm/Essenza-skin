import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

export class UpdateStockInsumoUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute(id: string, cantidad: number) {
    if (cantidad === 0) {
      throw new Error('La cantidad debe ser diferente de 0');
    }

    return this.insumoRepository.updateStock(id, cantidad);
  }
}
