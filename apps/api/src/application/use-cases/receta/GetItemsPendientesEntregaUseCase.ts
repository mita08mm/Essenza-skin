import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

export class GetItemsPendientesEntregaUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(pacienteId?: string) {
    return this.recetaRepository.getItemsPendientesEntrega(pacienteId);
  }
}
