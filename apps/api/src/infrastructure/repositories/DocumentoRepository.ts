import { PrismaClient, Documento, TipoArchivoMedico } from '@clinica/database';

export interface CreateDocumentoData {
  pacienteId: string;
  consultaId?: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoArchivoMedico;
  url: string;
  tamaño: number;
  mimeType: string;
}

export class DocumentoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateDocumentoData): Promise<Documento> {
    return this.prisma.documento.create({
      data,
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        consulta: {
          select: {
            id: true,
            fecha: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Documento | null> {
    return this.prisma.documento.findUnique({
      where: { id },
      include: {
        paciente: true,
        consulta: true,
      },
    });
  }

  async findByPaciente(pacienteId: string): Promise<Documento[]> {
    return this.prisma.documento.findMany({
      where: { pacienteId },
      include: {
        consulta: {
          select: {
            id: true,
            fecha: true,
            motivoConsulta: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByConsulta(consultaId: string): Promise<Documento[]> {
    return this.prisma.documento.findMany({
      where: { consultaId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTipo(tipo: TipoArchivoMedico, pacienteId?: string): Promise<Documento[]> {
    return this.prisma.documento.findMany({
      where: {
        tipo,
        ...(pacienteId && { pacienteId }),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: Partial<CreateDocumentoData>): Promise<Documento> {
    return this.prisma.documento.update({
      where: { id },
      data,
      include: {
        paciente: true,
        consulta: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.documento.delete({
      where: { id },
    });
  }

  async count(pacienteId?: string): Promise<number> {
    return this.prisma.documento.count({
      where: pacienteId ? { pacienteId } : undefined,
    });
  }
}
