import { ProductoRepository } from '../../../infrastructure/repositories/ProductoRepository';

export class GetProductoByIdUseCase {
  constructor(private productoRepository: ProductoRepository) {}

  async execute(id: string) {
    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto;
  }
}
