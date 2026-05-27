import { ConsultaRepository } from '../../../infrastructure/repositories/ConsultaRepository';

export class GetConsultasByPacienteUseCase {
  constructor(private tratamientoRepository: ConsultaRepository) {}

  async execute(pacienteId: string) {
    return this.tratamientoRepository.findByPaciente(pacienteId);
  }
}
