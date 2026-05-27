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
    // Convertir cadenas vacías a null para campos opcionales
    const sanitizedData = {
      ...data,
      nit: data.nit === '' ? null : data.nit,
      ciudad: data.ciudad === '' ? null : data.ciudad,
      pais: data.pais === '' ? null : data.pais,
      logo: data.logo === '' ? null : data.logo,
    };

    // Upsert: crea si no existe, actualiza si existe
    return this.prisma.configuracionClinica.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        nombre: sanitizedData.nombre || 'Clínica Estética',
        direccion: sanitizedData.direccion || '',
        telefono: sanitizedData.telefono || '',
        email: sanitizedData.email || '',
        nit: sanitizedData.nit || null,
        ciudad: sanitizedData.ciudad || null,
        pais: sanitizedData.pais || null,
        logo: sanitizedData.logo || null,
      },
      update: {
        ...(sanitizedData.nombre !== undefined && { nombre: sanitizedData.nombre }),
        ...(sanitizedData.direccion !== undefined && { direccion: sanitizedData.direccion }),
        ...(sanitizedData.telefono !== undefined && { telefono: sanitizedData.telefono }),
        ...(sanitizedData.email !== undefined && { email: sanitizedData.email }),
        ...(sanitizedData.nit !== undefined && { nit: sanitizedData.nit }),
        ...(sanitizedData.ciudad !== undefined && { ciudad: sanitizedData.ciudad }),
        ...(sanitizedData.pais !== undefined && { pais: sanitizedData.pais }),
        ...(sanitizedData.logo !== undefined && { logo: sanitizedData.logo }),
      },
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
