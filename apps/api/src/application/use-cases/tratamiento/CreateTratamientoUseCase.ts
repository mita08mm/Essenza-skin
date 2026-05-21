import { TratamientoRepository } from '../../../infrastructure/repositories/TratamientoRepository';
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
  parametros?: any;
  reaccionesInmediatas?: string;
  sesionNumero?: number;
  totalSesiones?: number;
  observaciones?: string;
  proximaSesion?: Date;
  medidas?: {
    peso?: number;
    talla?: number;
    imc?: number;
    circunferenciaCadera?: number;
    circunferenciaCintura?: number;
    circunferenciaBrazo?: number;
    circunferenciaPierna?: number;
    porcentajeGrasa?: number;
    masaMuscular?: number;
  };
}

export class CreateTratamientoUseCase {
  constructor(
    private tratamientoRepository: TratamientoRepository,
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
      parametros: data.parametros || {},
      ...(data.reaccionesInmediatas && { reaccionesInmediatas: data.reaccionesInmediatas }),
      ...(data.sesionNumero && { sesionNumero: data.sesionNumero }),
      ...(data.totalSesiones && { totalSesiones: data.totalSesiones }),
      ...(data.observaciones && { observaciones: data.observaciones }),
      ...(data.proximaSesion && { proximaSesion: data.proximaSesion }),
      medidas: data.medidas || {},
    });

    return tratamiento;
  }
}
