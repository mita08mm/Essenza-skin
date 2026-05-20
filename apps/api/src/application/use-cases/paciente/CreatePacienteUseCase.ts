import { PacienteRepository, CreatePacienteInput } from '../../infrastructure/repositories/PacienteRepository';

export class CreatePacienteUseCase {
  constructor(private pacienteRepository: PacienteRepository) {}

  async execute(input: CreatePacienteInput) {
    const existente = await this.pacienteRepository.findByDocumento(
      input.documento,
      input.tipoDocumento
    );

    if (existente) {
      throw new Error('Ya existe un paciente con ese documento');
    }

    return this.pacienteRepository.create(input);
  }
}
