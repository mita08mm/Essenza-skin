import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

export class GetMedicamentosLowStockUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute() {
    return this.medicamentoRepository.findLowStock();
  }
}
