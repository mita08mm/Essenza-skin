import { HistoriaClinicaRepository } from '../../../infrastructure/repositories/HistoriaClinicaRepository';

export class GetHistoriaClinicaByPacienteUseCase {
  constructor(private historiaClinicaRepository: HistoriaClinicaRepository) {}

  async execute(pacienteId: string) {
    let historiaClinica = await this.historiaClinicaRepository.findByPaciente(pacienteId);

    // Si no existe, crear una vacía y volver a traerla con todas las relaciones
    if (!historiaClinica) {
      await this.historiaClinicaRepository.create({
        paciente: {
          connect: { id: pacienteId },
        },
      });
      // Volver a traer con consultas incluidas
      historiaClinica = await this.historiaClinicaRepository.findByPaciente(pacienteId);
    }

    return historiaClinica;
  }
}
