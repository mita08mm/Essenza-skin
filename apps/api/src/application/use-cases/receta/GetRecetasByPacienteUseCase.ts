import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

export class GetRecetasByPacienteUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(pacienteId: string) {
    return this.recetaRepository.findByPaciente(pacienteId);
  }
}
