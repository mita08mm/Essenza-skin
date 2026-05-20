import { CitaRepository, CreateCitaInput } from '../../../infrastructure/repositories/CitaRepository';

export class CreateCitaUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute(input: CreateCitaInput) {
    // Validar que la fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCita = new Date(input.fecha);
    fechaCita.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      throw new Error('No se puede crear una cita en el pasado');
    }

    return this.citaRepository.create(input);
  }
}
