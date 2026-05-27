import { ConsultaRepository } from '../../../infrastructure/repositories/ConsultaRepository';

interface UpdateTratamientoDTO {
  tipoTratamiento?: 'FACIAL' | 'CORPORAL' | 'CAPILAR' | 'COMBINADO';
  zonaTratada?: string;
  objetivo?: string;
  evaluacionInicial?: string;
  protocolo?: string;
  observaciones?: string;
  proximaSesion?: Date;
}

export class UpdateConsultaUseCase {
  constructor(private tratamientoRepository: ConsultaRepository) {}

  async execute(id: string, data: UpdateTratamientoDTO) {
    // Verificar que existe
    const tratamientoExistente = await this.tratamientoRepository.findById(id);
    if (!tratamientoExistente) {
      throw new Error('Tratamiento no encontrado');
    }

    // Actualizar
    return this.tratamientoRepository.update(id, data);
  }
}
