import { TratamientoRepository } from '../../../infrastructure/repositories/TratamientoRepository';

export class GetTratamientosByPacienteUseCase {
  constructor(private tratamientoRepository: TratamientoRepository) {}

  async execute(pacienteId: string) {
    return this.tratamientoRepository.findByPaciente(pacienteId);
  }
}
