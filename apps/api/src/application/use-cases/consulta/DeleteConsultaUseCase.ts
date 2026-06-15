import { ConsultaRepository } from '../../../infrastructure/repositories/ConsultaRepository';

export class DeleteConsultaUseCase {
  constructor(private tratamientoRepository: ConsultaRepository) {}

  async execute(id: string) {
    const tratamientoExistente = await this.tratamientoRepository.findById(id);
    if (!tratamientoExistente) {
      throw new Error('Tratamiento no encontrado');
    }

    return this.tratamientoRepository.delete(id);
  }
}