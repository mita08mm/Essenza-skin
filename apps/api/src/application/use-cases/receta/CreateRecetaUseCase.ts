import { RecetaRepository } from '../../../infrastructure/repositories/RecetaRepository';

interface CreateItemRecetaInput {
  tipo: 'MEDICAMENTO' | 'INSUMO';
  itemId: string;
  nombre: string;
  cantidad: number;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  precio?: number;
}

interface CreateRecetaInput {
  pacienteId: string;
  evolucionId?: string;
  usuarioId: string;
  indicaciones?: string;
  items: CreateItemRecetaInput[];
}

export class CreateRecetaUseCase {
  constructor(private recetaRepository: RecetaRepository) {}

  async execute(data: CreateRecetaInput) {
    // Validations
    if (!data.items || data.items.length === 0) {
      throw new Error('La receta debe tener al menos un item');
    }

    for (const item of data.items) {
      if (item.cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      if (!item.nombre || item.nombre.trim() === '') {
        throw new Error('El nombre del item es requerido');
      }
    }

    return this.recetaRepository.create(data);
  }
}
