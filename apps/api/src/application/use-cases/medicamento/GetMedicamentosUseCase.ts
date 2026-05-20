import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

export class GetMedicamentosUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute(includeInactive = false) {
    return this.medicamentoRepository.findAll(includeInactive);
  }
}
