import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

export class GetRecetaByIdUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(id: string) {
    const receta = await this.recetaRepository.findById(id);

    if (!receta) {
      throw new Error('Receta no encontrada');
    }

    return receta;
  }
}
