import { ConfiguracionRepository } from '../../../infrastructure/repositories/ConfiguracionRepository';

export class GetConfiguracionUseCase {
  constructor(private configuracionRepository: ConfiguracionRepository) {}

  async execute() {
    const configuracion = await this.configuracionRepository.get();
    
    // Si no existe configuración, devolver valores por defecto
    if (!configuracion) {
      return {
        nombre: 'Clínica Médica',
        direccion: 'Dirección no configurada',
        telefono: 'Teléfono no configurado',
        email: 'email@example.com',
        nit: 'NIT no configurado',
        logo: null,
        isPublic: false
      };
    }

    return configuracion;
  }
}
