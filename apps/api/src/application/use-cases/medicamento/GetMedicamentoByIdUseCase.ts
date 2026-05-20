import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

export class GetMedicamentoByIdUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute(id: string) {
    const medicamento = await this.medicamentoRepository.findById(id);

    if (!medicamento) {
      throw new Error('Medicamento no encontrado');
    }

    return medicamento;
  }
}
