import { PrismaClient, Prescripcion, Prisma } from '@clinica/database';

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

export class PrescripcionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProtocoloInput): Promise<Prescripcion> {
    return this.prisma.prescripcion.create({
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
            nombre: item.nombre,
            cantidad: item.cantidad ?? 1,
            aplicacion: item.indicaciones,
          })),
        },
      },
      include: {
        paciente: true,
        usuario: true,
        items: true,
      },
    });
  }

  async findAll(): Promise<Prescripcion[]> {
    return this.prisma.prescripcion.findMany({
      include: {
        paciente: true,
        usuario: true,
        items: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Prescripcion | null> {
    return this.prisma.prescripcion.findUnique({
      where: { id },
      include: {
        paciente: true,
        usuario: true,
        items: true,
      },
    });
  }

  async findByPaciente(pacienteId: string): Promise<Prescripcion[]> {
    return this.prisma.prescripcion.findMany({
      where: { pacienteId },
      include: {
        usuario: true,
        items: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async update(id: string, data: Prisma.PrescripcionUpdateInput): Promise<Prescripcion> {
    return this.prisma.prescripcion.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });
  }

  async updateItemEstado(itemId: string, estado: 'INDICADO' | 'ADQUIRIDO' | 'EN_USO' | 'COMPLETADO'): Promise<any> {
    return this.prisma.itemPrescripcion.update({
      where: { id: itemId },
      data: { estado },
    });
  }
}
