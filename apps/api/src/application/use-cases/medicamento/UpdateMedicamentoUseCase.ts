import { MedicamentoRepository } from '../../../infrastructure/repositories/MedicamentoRepository';

interface UpdateMedicamentoInput {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export class UpdateMedicamentoUseCase {
  constructor(private medicamentoRepository: MedicamentoRepository) {}

  async execute(id: string, data: UpdateMedicamentoInput) {
    const medicamento = await this.medicamentoRepository.findById(id);

    if (!medicamento) {
      throw new Error('Medicamento no encontrado');
    }

    if (data.precio !== undefined && data.precio < 0) {
      throw new Error('El precio debe ser mayor o igual a 0');
    }

    // Si se cambia el código, verificar que no exista
    if (data.codigo && data.codigo !== medicamento.codigo) {
      const existente = await this.medicamentoRepository.findByCodigo(data.codigo);
      if (existente) {
        throw new Error('Ya existe un medicamento con ese código');
      }
    }

    return this.medicamentoRepository.update(id, data);
  }
}
