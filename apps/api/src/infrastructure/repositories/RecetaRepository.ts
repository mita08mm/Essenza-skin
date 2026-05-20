import { PrismaClient } from '@clinica/database';

interface CreateItemRecetaInput {
  tipo: 'MEDICAMENTO' | 'INSUMO';
  itemId: string;
  nombre: string;
  cantidad: number;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  precio?: number;
}

interface CreateRecetaInput {
  pacienteId: string;
  evolucionId?: string;
  usuarioId: string;
  indicaciones?: string;
  items: CreateItemRecetaInput[];
}

interface UpdateRecetaInput {
  indicaciones?: string;
}

interface UpdateItemEstadoInput {
  itemId: string;
  estado: 'PRESCRITO' | 'ENTREGADO';
}

export class RecetaRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRecetaInput): Promise<any> {
    return this.prisma.receta.create({
      data: {
        pacienteId: data.pacienteId,
        evolucionId: data.evolucionId,
        usuarioId: data.usuarioId,
        indicaciones: data.indicaciones,
        items: {
          create: data.items.map((item) => ({
            tipo: item.tipo,
            itemId: item.itemId,
            nombre: item.nombre,
            cantidad: item.cantidad,
            dosis: item.dosis,
            frecuencia: item.frecuencia,
            duracion: item.duracion,
            precio: item.precio,
          })),
        },
      },
      include: {
        paciente: true,
        usuario: true,
        evolucion: true,
        items: {
          include: {
            medicamento: true,
            insumo: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<any> {
    return this.prisma.receta.findMany({
      include: {
        paciente: true,
        usuario: true,
        items: {
          include: {
            medicamento: true,
            insumo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.receta.findUnique({
      where: { id },
      include: {
        paciente: true,
        usuario: true,
        evolucion: true,
        items: {
          include: {
            medicamento: true,
            insumo: true,
          },
        },
      },
    });
  }

  async findByPaciente(pacienteId: string): Promise<any> {
    return this.prisma.receta.findMany({
      where: { pacienteId },
      include: {
        usuario: true,
        items: {
          include: {
            medicamento: true,
            insumo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async update(id: string, data: UpdateRecetaInput): Promise<any> {
    return this.prisma.receta.update({
      where: { id },
      data,
      include: {
        paciente: true,
        usuario: true,
        items: {
          include: {
            medicamento: true,
            insumo: true,
          },
        },
      },
    });
  }

  async updateItemEstado(updates: UpdateItemEstadoInput[]): Promise<any> {
    // Actualizar múltiples items en una transacción
    return this.prisma.$transaction(
      updates.map((update) =>
        this.prisma.itemReceta.update({
          where: { id: update.itemId },
          data: { estado: update.estado },
        })
      )
    );
  }

  async delete(id: string): Promise<any> {
    return this.prisma.receta.delete({
      where: { id },
    });
  }

  async getItemsPendientesEntrega(pacienteId?: string): Promise<any> {
    return this.prisma.itemReceta.findMany({
      where: {
        estado: 'PRESCRITO',
        ...(pacienteId && {
          receta: {
            pacienteId,
          },
        }),
      },
      include: {
        receta: {
          include: {
            paciente: true,
          },
        },
        medicamento: true,
        insumo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
