import { CitaRepository } from '../../../infrastructure/repositories/CitaRepository';

export class GetCitasByFechaUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute(fecha: Date) {
    return this.citaRepository.findByFecha(fecha);
  }
}
