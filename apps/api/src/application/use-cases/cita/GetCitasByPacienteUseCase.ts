import { CitaRepository } from '../../../infrastructure/repositories/CitaRepository';

export class GetCitasByPacienteUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute(pacienteId: string) {
    return this.citaRepository.findByPaciente(pacienteId);
  }
}
