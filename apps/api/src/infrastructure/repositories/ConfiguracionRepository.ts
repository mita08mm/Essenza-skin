import { PrismaClient, ConfiguracionClinica } from '@clinica/database';

export interface UpdateConfiguracionInput {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  nit?: string;
  ciudad?: string;
  pais?: string;
  logo?: string;
}

const SINGLETON_ID = 'singleton';

export class ConfiguracionRepository {
  constructor(private prisma: PrismaClient) {}

  async get(): Promise<ConfiguracionClinica | null> {
    return this.prisma.configuracionClinica.findUnique({
      where: { id: SINGLETON_ID },
    });
  }

  async update(data: UpdateConfiguracionInput): Promise<ConfiguracionClinica> {
    // Upsert: crea si no existe, actualiza si existe
    return this.prisma.configuracionClinica.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        nombre: data.nombre || 'Clínica Estética',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        email: data.email || '',
        nit: data.nit,
        ciudad: data.ciudad,
        pais: data.pais,
        logo: data.logo,
      },
      update: data,
    });
  }

  async getOrCreate(): Promise<ConfiguracionClinica> {
    const existing = await this.get();
    if (existing) return existing;

    // Crear configuración por defecto
    return this.prisma.configuracionClinica.create({
      data: {
        id: SINGLETON_ID,
        nombre: 'Clínica Estética',
        direccion: 'Av. Principal #123',
        telefono: '+591 3 1234567',
        email: 'contacto@clinica.com',
        nit: '',
        ciudad: 'Santa Cruz',
        pais: 'Bolivia',
      },
    });
  }
}
