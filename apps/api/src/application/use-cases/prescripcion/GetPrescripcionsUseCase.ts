import { PrescripcionRepository } from '../../../infrastructure/repositories/PrescripcionRepository';

export class GetPrescripcionsUseCase {
  constructor(private protocoloRepository: PrescripcionRepository) {}

  async execute() {
    return this.protocoloRepository.findAll();
  }
}
