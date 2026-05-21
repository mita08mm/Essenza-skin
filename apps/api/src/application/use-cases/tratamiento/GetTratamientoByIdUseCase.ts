import { TratamientoRepository } from '../../../infrastructure/repositories/TratamientoRepository';

export class GetTratamientoByIdUseCase {
  constructor(private tratamientoRepository: TratamientoRepository) {}

  async execute(id: string) {
    const tratamiento = await this.tratamientoRepository.findById(id);

    if (!tratamiento) {
      throw new Error('Tratamiento no encontrado');
    }

    return tratamiento;
  }
}
