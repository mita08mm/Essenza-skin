import { PrismaClient } from '@clinica/database';

export interface Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  rol: string;
  activo: boolean;
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
        rol: true,
        activo: true,
      },
    });
  }
}
