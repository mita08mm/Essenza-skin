import { CobroRepository } from '../../../infrastructure/repositories/CobroRepository';

export class GetCobrosUseCase {
  constructor(private cobroRepository: CobroRepository) {}

  async execute() {
    return this.cobroRepository.findAll();
  }
}
