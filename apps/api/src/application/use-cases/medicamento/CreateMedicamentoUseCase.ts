import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

interface CreateMedicamentoInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
}

export class CreateMedicamentoUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute(data: CreateMedicamentoInput) {
    // Validaciones
    if (!data.codigo || data.codigo.trim() === '') {
      throw new Error('El código es requerido');
    }

    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre es requerido');
    }

    if (data.precio < 0) {
      throw new Error('El precio debe ser mayor o igual a 0');
    }

    // Verificar que el código no existe
    const existente = await this.medicamentoRepository.findByCodigo(data.codigo);
    if (existente) {
      throw new Error('Ya existe un medicamento con ese código');
    }

    return this.medicamentoRepository.create(data);
  }
}
