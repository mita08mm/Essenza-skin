import { ConfiguracionRepository, UpdateConfiguracionInput } from '../../../infrastructure/repositories/ConfiguracionRepository';

export class UpdateConfiguracionUseCase {
  constructor(private configuracionRepository: ConfiguracionRepository) {}

  async execute(data: UpdateConfiguracionInput) {
    // Validación: solo validar si los campos están presentes en la actualización
    if (data.nombre !== undefined && (!data.nombre || data.nombre.trim() === '')) {
      throw new Error('El nombre de la clínica es requerido');
    }

    if (data.email !== undefined && (!data.email || !this.isValidEmail(data.email))) {
      throw new Error('El email no es válido');
    }

    const configuracion = await this.configuracionRepository.update(data);
    return configuracion;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
