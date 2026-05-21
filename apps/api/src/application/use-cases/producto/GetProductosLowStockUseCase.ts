import { ProductoRepository } from '../../../infrastructure/repositories/ProductoRepository';

export class GetProductosLowStockUseCase {
  constructor(private productoRepository: ProductoRepository) {}

  async execute() {
    return this.productoRepository.findLowStock();
  }
}
