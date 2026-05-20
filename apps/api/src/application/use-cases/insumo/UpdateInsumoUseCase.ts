import { InsumoRepository } from '../../../infrastructure/repositories/InsumoRepository';

interface UpdateInsumoInput {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export class UpdateInsumoUseCase {
  constructor(private insumoRepository: InsumoRepository) {}

  async execute(id: string, data: UpdateInsumoInput) {
    const insumo = await this.insumoRepository.findById(id);

    if (!insumo) {
      throw new Error('Insumo no encontrado');
    }

    if (data.precio !== undefined && data.precio < 0) {
      throw new Error('El precio debe ser mayor o igual a 0');
    }

    if (data.codigo && data.codigo !== insumo.codigo) {
      const existente = await this.insumoRepository.findByCodigo(data.codigo);
      if (existente) {
        throw new Error('Ya existe un insumo con ese código');
      }
    }

    return this.insumoRepository.update(id, data);
  }
}
