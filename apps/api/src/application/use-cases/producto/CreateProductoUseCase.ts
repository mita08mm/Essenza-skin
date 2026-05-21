import { ProductoRepository } from '../../../infrastructure/repositories/ProductoRepository';

interface CreateProductoDTO {
  codigo: string;
  nombre: string;
  tipo: 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
  marca?: string;
  principioActivo?: string;
}

export class CreateProductoUseCase {
  constructor(private productoRepository: ProductoRepository) {}

  async execute(data: CreateProductoDTO) {
    // Verificar que no exista el código
    const existente = await this.productoRepository.findByCodigo(data.codigo);
    if (existente) {
      throw new Error('Ya existe un producto con ese código');
    }

    return this.productoRepository.create(data);
  }
}
