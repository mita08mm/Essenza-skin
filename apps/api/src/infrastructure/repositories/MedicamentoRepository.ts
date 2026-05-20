import { PrismaClient } from '@clinica/database';

interface CreateMedicamentoInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
}

interface UpdateMedicamentoInput {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export class MedicamentoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMedicamentoInput): Promise<any> {
    return this.prisma.medicamento.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock || 0,
        stockMinimo: data.stockMinimo || 10,
      },
    });
  }

  async findAll(includeInactive = false): Promise<any> {
    return this.prisma.medicamento.findMany({
      where: includeInactive ? {} : { activo: true },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.medicamento.findUnique({
      where: { id },
    });
  }

  async findByCodigo(codigo: string): Promise<any> {
    return this.prisma.medicamento.findUnique({
      where: { codigo },
    });
  }

  async findLowStock(): Promise<any> {
    return this.prisma.medicamento.findMany({
      where: {
        activo: true,
        stock: {
          lte: this.prisma.medicamento.fields.stockMinimo,
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  async update(id: string, data: UpdateMedicamentoInput): Promise<any> {
    return this.prisma.medicamento.update({
      where: { id },
      data,
    });
  }

  async updateStock(id: string, cantidad: number): Promise<any> {
    const medicamento = await this.findById(id);
    if (!medicamento) {
      throw new Error('Medicamento no encontrado');
    }

    const nuevoStock = medicamento.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return this.prisma.medicamento.update({
      where: { id },
      data: {
        stock: nuevoStock,
      },
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.medicamento.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
