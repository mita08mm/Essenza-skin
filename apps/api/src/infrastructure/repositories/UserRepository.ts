import { PrismaClient, Rol } from '@clinica/database';
import bcrypt from 'bcryptjs';

export interface Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: Rol;
  activo: boolean;
}

export interface CreateUsuarioInput {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: Rol;
}

export interface UpdateUsuarioInput {
  activo?: boolean;
}

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
    });
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
    });
  }

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        password: false,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateUsuarioInput): Promise<Omit<Usuario, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.prisma.usuario.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        activo: true,
      },
      select: {
        id: true,
        email: true,
        password: false,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
    });
  }

  async update(id: string, data: UpdateUsuarioInput): Promise<Omit<Usuario, 'password'>> {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        password: false,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
    });
  }
}
