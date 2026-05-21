import { PrismaClient, Protocolo, Prisma } from '@clinica/database';

interface CreateItemProtocoloInput {
  productoId: string;
  nombre: string;
  cantidad: number;
  aplicacion: string;
  frecuencia: string;
  duracion?: string;
  precio?: number;
  estado?: 'INDICADO' | 'ADQUIRIDO' | 'EN_USO' | 'COMPLETADO';
}

interface CreateProtocoloInput {
  pacienteId: string;
  tratamientoId?: string;
  usuarioId: string;
  nombre: string;
  indicaciones?: string;
  duracion?: string;
  items: CreateItemProtocoloInput[];
}

export class ProtocoloRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProtocoloInput): Promise<Protocolo> {
    return this.prisma.protocolo.create({
      data: {
        paciente: {
          connect: { id: data.pacienteId },
        },
        ...(data.tratamientoId && {
          tratamiento: {
            connect: { id: data.tratamientoId },
          },
        }),
        usuario: {
          connect: { id: data.usuarioId },
        },
        nombre: data.nombre,
        indicaciones: data.indicaciones,
        duracion: data.duracion,
        items: {
          create: data.items.map((item) => ({
            tipo: 'PRODUCTO' as const,
            itemId: item.productoId,
            nombre: item.nombre,
            cantidad: item.cantidad,
            producto: {
              connect: { id: item.productoId },
            },
            aplicacion: item.aplicacion,
            frecuencia: item.frecuencia,
            duracion: item.duracion,
            precio: item.precio,
            estado: item.estado || 'INDICADO',
          })),
        },
      },
      include: {
        paciente: true,
        usuario: true,
        tratamiento: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Protocolo[]> {
    return this.prisma.protocolo.findMany({
      include: {
        paciente: true,
        usuario: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Protocolo | null> {
    return this.prisma.protocolo.findUnique({
      where: { id },
      include: {
        paciente: true,
        usuario: true,
        tratamiento: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async findByPaciente(pacienteId: string): Promise<Protocolo[]> {
    return this.prisma.protocolo.findMany({
      where: { pacienteId },
      include: {
        usuario: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findByTratamiento(tratamientoId: string): Promise<Protocolo[]> {
    return this.prisma.protocolo.findMany({
      where: { tratamientoId },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async update(id: string, data: Prisma.ProtocoloUpdateInput): Promise<Protocolo> {
    return this.prisma.protocolo.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async updateItemEstado(itemId: string, estado: 'INDICADO' | 'ADQUIRIDO' | 'EN_USO' | 'COMPLETADO'): Promise<any> {
    return this.prisma.itemProtocolo.update({
      where: { id: itemId },
      data: { estado },
    });
  }
}
