import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

export class GetRecetasUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute() {
    return this.recetaRepository.findAll();
  }
}
