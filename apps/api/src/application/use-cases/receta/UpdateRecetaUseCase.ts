import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

interface UpdateRecetaInput {
  indicaciones?: string;
}

export class UpdateRecetaUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(id: string, data: UpdateRecetaInput) {
    const receta = await this.recetaRepository.findById(id);

    if (!receta) {
      throw new Error('Receta no encontrada');
    }

    return this.recetaRepository.update(id, data);
  }
}
