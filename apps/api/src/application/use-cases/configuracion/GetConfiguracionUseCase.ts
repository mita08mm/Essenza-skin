import { ConfiguracionRepository } from '../../../infrastructure/repositories/ConfiguracionRepository';

export class GetConfiguracionUseCase {
  constructor(private configuracionRepository: ConfiguracionRepository) {}

  async execute() {
    // Usar getOrCreate para asegurar que siempre exista una configuración
    return await this.configuracionRepository.getOrCreate();
  }
}
