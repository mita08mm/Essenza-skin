import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

export class UpdateStockMedicamentoUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute(id: string, cantidad: number) {
    if (cantidad === 0) {
      throw new Error('La cantidad debe ser diferente de 0');
    }

    return this.medicamentoRepository.updateStock(id, cantidad);
  }
}
