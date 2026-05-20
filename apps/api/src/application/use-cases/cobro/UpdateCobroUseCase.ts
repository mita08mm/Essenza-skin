import { CobroRepository, UpdateCobroInput } from '../../../infrastructure/repositories/CobroRepository';

export class UpdateCobroUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute(id: string, input: UpdateCobroInput) {
    const cobro = await this.cobroRepository.findById(id);
    
    if (!cobro) {
      throw new Error('Cobro no encontrado');
    }

    if (cobro.estado === 'PAGADO') {
      throw new Error('No se puede modificar un cobro que ya está pagado');
    }

    return this.cobroRepository.update(id, input);
  }
}
