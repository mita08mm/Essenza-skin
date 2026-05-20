import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

export class GetInsumoByIdUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute(id: string) {
    const insumo = await this.insumoRepository.findById(id);

    if (!insumo) {
      throw new Error('Insumo no encontrado');
    }

    return insumo;
  }
}
