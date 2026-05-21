import { ProductoRepository } from '../../../infrastructure/repositories/ProductoRepository';

export class UpdateStockProductoUseCase {
  constructor(private productoRepository: ProductoRepository) {}

  async execute(id: string, cantidad: number) {
    return this.productoRepository.updateStock(id, cantidad);
  }
}
