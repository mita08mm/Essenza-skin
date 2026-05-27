import { ConsultaRepository } from '../../../infrastructure/repositories/ConsultaRepository';
import { HistoriaClinicaRepository } from '../../../infrastructure/repositories/HistoriaClinicaRepository';

interface CreateTratamientoDTO {
  pacienteId: string;
  usuarioId: string;
  citaId?: string;
  tipoTratamiento: 'FACIAL' | 'CORPORAL' | 'CAPILAR' | 'COMBINADO';
  nombreTratamiento: string;
  zonaTratada: string;
  objetivo: string;
  evaluacionInicial?: string;
  protocolo?: string;
  observaciones?: string;
  proximaSesion?: Date;
}

export class CreateConsultaUseCase {
  constructor(
    private tratamientoRepository: ConsultaRepository,
    private historiaClinicaRepository: HistoriaClinicaRepository
  ) {}

  async execute(data: CreateTratamientoDTO) {
    // Obtener o crear historia clínica
    let historiaClinica = await this.historiaClinicaRepository.findByPaciente(data.pacienteId);

    if (!historiaClinica) {
      historiaClinica = await this.historiaClinicaRepository.create({
        paciente: {
          connect: { id: data.pacienteId },
        },
      });
    }

    // Crear tratamiento
    const tratamiento = await this.tratamientoRepository.create({
      paciente: {
        connect: { id: data.pacienteId },
      },
      historiaClinica: {
        connect: { id: historiaClinica.id },
      },
      usuario: {
        connect: { id: data.usuarioId },
      },
      ...(data.citaId && {
        cita: {
          connect: { id: data.citaId },
        },
      }),
      tipoTratamiento: data.tipoTratamiento,
      nombreTratamiento: data.nombreTratamiento || '',
      zonaTratada: data.zonaTratada,
      objetivo: data.objetivo,
      ...(data.evaluacionInicial && { evaluacionInicial: data.evaluacionInicial }),
      ...(data.protocolo && { protocolo: data.protocolo }),
      ...(data.observaciones && { observaciones: data.observaciones }),
      ...(data.proximaSesion && { proximaSesion: data.proximaSesion }),
    });

    return tratamiento;
  }
}
