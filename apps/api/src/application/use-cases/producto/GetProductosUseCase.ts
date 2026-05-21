import { ProductoRepository } from '../../../infrastructure/repositories/ProductoRepository';

export class GetProductosUseCase {
  constructor(private productoRepository: ProductoRepository) {}

  async execute(includeInactive = false) {
    return this.productoRepository.findAll(includeInactive);
  }
}
