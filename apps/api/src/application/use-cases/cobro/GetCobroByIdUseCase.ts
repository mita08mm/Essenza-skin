import { CobroRepository } from '../../../infrastructure/repositories/CobroRepository';

export class GetCobroByIdUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute(id: string) {
    const cobro = await this.cobroRepository.findById(id);
    
    if (!cobro) {
      throw new Error('Cobro no encontrado');
    }

    return cobro;
  }
}
