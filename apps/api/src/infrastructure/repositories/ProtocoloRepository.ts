import { PrismaClient, Protocolo, Prisma } from '@clinica/database';

interface CreateItemProtocoloInput {
  nombre: string;
  indicaciones: string;
  cantidad?: number;
}

interface CreateProtocoloInput {
  pacienteId: string;
  usuarioId: string;
  nombre: string;
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
        usuario: {
          connect: { id: data.usuarioId },
        },
        nombre: data.nombre,
        items: {
          create: data.items.map((item) => ({
            tipo: 'RECOMENDACION' as const,
            itemId: item.nombre,
            nombre: item.nombre,
            cantidad: item.cantidad ?? 1,
            aplicacion: item.indicaciones,
            frecuencia: item.indicaciones,
          })),
        },
      },
      include: {
        paciente: true,
        usuario: true,
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
