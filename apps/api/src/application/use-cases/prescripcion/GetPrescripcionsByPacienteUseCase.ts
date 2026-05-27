import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

export class GetPrescripcionsByPacienteUseCase {
  constructor(private protocoloRepository: PrescripcionRepository) {}

  async execute(pacienteId: string) {
    return this.protocoloRepository.findByPaciente(pacienteId);
  }
}
