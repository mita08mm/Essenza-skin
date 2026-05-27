import { ConfiguracionRepository, ConfiguracionUpdateData } from '../../../infrastructure/repositories/ConfiguracionRepository';

export class UpdateConfiguracionUseCase {
  constructor(private configuracionRepository: ConfiguracionRepository) {}

  async execute(data: ConfiguracionUpdateData) {
    // Validación básica
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre de la clínica es requerido');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('El email no es válido');
    }

    const configuracion = await this.configuracionRepository.upsert(data);
    return configuracion;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
