import { CitaRepository } from '../../../infrastructure/repositories/CitaRepository';

export class GetCitasUseCase {
  constructor(private citaRepository: CitaRepository) {}

  async execute() {
    return this.citaRepository.findAll();
  }
}
