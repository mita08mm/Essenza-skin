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

  async updateWithItems(
    id: string,
    data: {
      pacienteId?: string;
      nombre?: string;
      items?: Array<{ nombre: string; indicaciones: string; cantidad?: number }>;
    }
  ): Promise<Prescripcion> {
    // Si se envían items, primero eliminar todos los items existentes y crear los nuevos
    const updateData: any = {
      ...(data.nombre && { nombre: data.nombre }),
      ...(data.pacienteId && {
        paciente: {
          connect: { id: data.pacienteId },
        },
      }),
    };

    if (data.items) {
      updateData.items = {
        deleteMany: {}, // Eliminar todos los items existentes
        create: data.items.map((item) => ({
          nombre: item.nombre,
          cantidad: item.cantidad ?? 1,
          aplicacion: item.indicaciones,
        })),
      };
    }

    return this.prisma.prescripcion.update({
      where: { id },
      data: updateData,
      include: {
        paciente: true,
        usuario: true,
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

  async delete(id: string): Promise<Prescripcion> {
    return this.prisma.prescripcion.delete({
      where: { id },
    });
  }

  async deleteItem(itemId: string): Promise<any> {
    return this.prisma.itemPrescripcion.delete({
      where: { id: itemId },
    });
  }
}
