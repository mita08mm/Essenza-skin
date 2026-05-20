import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

interface CreateInsumoInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
}

export class CreateInsumoUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute(data: CreateInsumoInput) {
    if (!data.codigo || data.codigo.trim() === '') {
      throw new Error('El código es requerido');
    }

    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre es requerido');
    }

    if (data.precio < 0) {
      throw new Error('El precio debe ser mayor o igual a 0');
    }

    const existente = await this.insumoRepository.findByCodigo(data.codigo);
    if (existente) {
      throw new Error('Ya existe un insumo con ese código');
    }

    return this.insumoRepository.create(data);
  }
}
