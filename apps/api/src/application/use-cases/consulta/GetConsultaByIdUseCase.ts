import { ConsultaRepository } from '../../../infrastructure/repositories/ConsultaRepository';

export class GetConsultaByIdUseCase {
  constructor(private tratamientoRepository: ConsultaRepository) {}

  async execute(id: string) {
    const tratamiento = await this.tratamientoRepository.findById(id);

    if (!tratamiento) {
      throw new Error('Tratamiento no encontrado');
    }

    return tratamiento;
  }
}
