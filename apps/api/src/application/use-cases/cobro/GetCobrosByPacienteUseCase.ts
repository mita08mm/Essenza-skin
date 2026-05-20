import { CobroRepository } from '../../../infrastructure/repositories/CobroRepository';

export class GetCobrosByPacienteUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute(pacienteId: string) {
    return this.cobroRepository.findByPaciente(pacienteId);
  }
}
