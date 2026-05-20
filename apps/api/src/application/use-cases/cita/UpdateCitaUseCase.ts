import { CitaRepository, UpdateCitaInput } from '../../../infrastructure/repositories/CitaRepository';

export class UpdateCitaUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute(id: string, input: UpdateCitaInput) {
    const cita = await this.citaRepository.findById(id);
    
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    return this.citaRepository.update(id, input);
  }
}
