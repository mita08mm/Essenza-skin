import { PrismaClient } from '@clinica/database';

interface CreateInsumoInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
}

interface UpdateInsumoInput {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export class InsumoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateInsumoInput): Promise<any> {
    return this.prisma.insumo.create({
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
    return this.prisma.insumo.findMany({
      where: includeInactive ? {} : { activo: true },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.insumo.findUnique({
      where: { id },
    });
  }

  async findByCodigo(codigo: string): Promise<any> {
    return this.prisma.insumo.findUnique({
      where: { codigo },
    });
  }

  async findLowStock(): Promise<any> {
    return this.prisma.insumo.findMany({
      where: {
        activo: true,
        stock: {
          lte: this.prisma.insumo.fields.stockMinimo,
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  async update(id: string, data: UpdateInsumoInput): Promise<any> {
    return this.prisma.insumo.update({
      where: { id },
      data,
    });
  }

  async updateStock(id: string, cantidad: number): Promise<any> {
    const insumo = await this.findById(id);
    if (!insumo) {
      throw new Error('Insumo no encontrado');
    }

    const nuevoStock = insumo.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return this.prisma.insumo.update({
      where: { id },
      data: {
        stock: nuevoStock,
      },
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.insumo.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
