import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

export class GetInsumosLowStockUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute() {
    return this.insumoRepository.findLowStock();
  }
}
