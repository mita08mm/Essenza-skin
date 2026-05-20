import { CitaRepository } from '../../../infrastructure/repositories/CitaRepository';

export class CancelarCitaUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute(id: string, notas?: string) {
    const cita = await this.citaRepository.findById(id);
    
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    if (cita.estado === 'CANCELADA') {
      throw new Error('La cita ya está cancelada');
    }

    if (cita.estado === 'COMPLETADA') {
      throw new Error('No se puede cancelar una cita completada');
    }

    return this.citaRepository.cancelar(id, notas);
  }
}
