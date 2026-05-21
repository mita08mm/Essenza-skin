import { PrismaClient, Producto } from '@clinica/database';

interface CreateProductoInput {
  codigo: string;
  nombre: string;
  tipo: 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';
  descripcion?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
  marca?: string;
  principioActivo?: string;
}

interface UpdateProductoInput {
  codigo?: string;
  nombre?: string;
  tipo?: 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  marca?: string;
  principioActivo?: string;
  activo?: boolean;
}

export class ProductoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductoInput): Promise<Producto> {
    return this.prisma.producto.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        tipo: data.tipo,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock || 0,
        stockMinimo: data.stockMinimo || 10,
        marca: data.marca,
        principioActivo: data.principioActivo,
      },
    });
  }

  async findAll(includeInactive = false): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: includeInactive ? {} : { activo: true },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id },
    });
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { codigo },
    });
  }

  async findByTipo(tipo: string): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        tipo: tipo as any,
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findLowStock(): Promise<Producto[]> {
    const productos = await this.prisma.producto.findMany({
      where: {
        activo: true,
      },
    });

    return productos.filter(p => p.stock <= p.stockMinimo);
  }

  async update(id: string, data: UpdateProductoInput): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id },
      data,
    });
  }

  async updateStock(id: string, cantidad: number): Promise<Producto> {
    const producto = await this.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return this.prisma.producto.update({
      where: { id },
      data: {
        stock: nuevoStock,
      },
    });
  }

  async delete(id: string): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
