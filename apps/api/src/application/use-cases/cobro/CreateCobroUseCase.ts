import { CobroRepository, CreateCobroInput } from '../../../infrastructure/repositories/CobroRepository';

export class CreateCobroUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute(input: CreateCobroInput) {
    // Validar que haya al menos un item
    if (!input.items || input.items.length === 0) {
      throw new Error('Debe incluir al menos un item en el cobro');
    }

    // Validar que las cantidades sean positivas
    for (const item of input.items) {
      if (item.cantidad <= 0) {
        throw new Error('La cantidad de cada item debe ser mayor a 0');
      }
      if (item.precioUnitario < 0) {
        throw new Error('El precio unitario no puede ser negativo');
      }
    }

    return this.cobroRepository.create(input);
  }
}
