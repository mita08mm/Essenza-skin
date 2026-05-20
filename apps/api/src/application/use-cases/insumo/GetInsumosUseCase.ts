import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

export class GetInsumosUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute(includeInactive = false) {
    return this.insumoRepository.findAll(includeInactive);
  }
}
