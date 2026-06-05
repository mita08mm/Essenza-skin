import { PacienteRepository } from '../../../infrastructure/repositories/PacienteRepository';

/**
 * Caso de uso para eliminar un paciente de forma permanente.
 * Elimina en cascada toda la información relacionada:
 * - Historia clínica
 * - Consultas y prescripciones
 * - Citas
 * - Cobros y pagos
 * - Documentos
 */
export class DeletePacienteUseCase {
  constructor(private pacienteRepository: PacienteRepository) {}

  async execute(id: string): Promise<void> {
    const paciente = await this.pacienteRepository.findById(id);

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Hard delete - elimina en cascada por configuración de Prisma schema
    await this.pacienteRepository.delete(id);
  }
}
